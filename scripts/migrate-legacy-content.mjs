/**
 * Legacy -> registered schema migration.
 * ------------------------------------------------------------------
 * The studio schema was refactored (and several types renamed) without the
 * dataset being migrated, so the live content still uses the old `_type`
 * values. This script rewrites them onto the registered schema.
 *
 * Usage
 * -----
 *   # 1. inspect the plan (read-only, no token required)
 *   node scripts/migrate-legacy-content.mjs
 *
 *   # 2. create a restorable backup (still read-only against the dataset)
 *   node scripts/migrate-legacy-content.mjs --backup .migration-backup.json
 *
 *   # 3. apply (needs a write token AND a verified backup)
 *   $env:SANITY_API_TOKEN = "..."      # Sanity > API > Tokens > Add token
 *   node scripts/migrate-legacy-content.mjs --backup .migration-backup.json --apply
 *
 * `--backup <path>` is MANDATORY with `--apply`. The script refuses to write a
 * single byte to the dataset until it has written the backup to disk, re-read
 * it, parsed it and matched a checksum. There is no undo: Sanity patches do not
 * create drafts, and this dataset currently has zero drafts
 * (`count(*[_id in path("drafts.**")]) == 0`), so a `_type` rewrite leaves no
 * `_rev` trail. The backup file is the only rollback source.
 *
 * Renames are done in place (patching only `_type`) so document `_id`s —
 * and therefore every reference pointing at them — stay valid.
 *
 * Everything this script does NOT know how to map is printed in the report at
 * the end rather than being silently dropped.
 *
 * DEPLOYMENT ORDER — see docs/c5-migration-plan.md. Short version: deploying
 * the schema first does NOT protect the Studio from unresolved references,
 * because Sanity keeps rendering documents whose `_type` is no longer in the
 * schema. Migrate the data first unless you accept a broken-reference window.
 */

import { createHash } from "node:crypto";
import { mkdir, readFile as fsReadFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { createClient } from "@sanity/client";

const APPLY = process.argv.includes("--apply");
const BACKUP_PATH = readFlag("--backup");

function readFlag(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} requires a path, e.g. ${name} .migration-backup.json`);
  }
  return value;
}

const env = {};
for (const line of (await readFile(".env.local")).split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
  if (match) env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-02";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET not found in .env.local",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

if (APPLY && !BACKUP_PATH) {
  throw new Error(
    "Refusing to write without a backup.\n" +
      "Re-run with:  --backup .migration-backup.json --apply\n" +
      "This dataset has zero drafts, so a _type rewrite cannot be undone by " +
      "Sanity. The backup file is the only rollback source.",
  );
}

/** @type {{skipped: string[], notes: string[]}} */
const report = { skipped: [], notes: [] };

const warn = (msg) => report.notes.push(msg);
const skip = (msg) => report.skipped.push(msg);

async function readFile(path) {
  try {
    return await fsReadFile(path, "utf8");
  } catch {
    return "";
  }
}

function patchType(doc) {
  if (APPLY) {
    return client.patch(doc._id).set({ _type: doc.to }).commit();
  }
  return Promise.resolve();
}

// ---------------------------------------------------------------------------
// Backup
// ---------------------------------------------------------------------------

/**
 * Walk a document body and record every reference it holds, with the exact
 * path. Done in JS rather than GROQ so it does not depend on knowing every
 * reference-bearing field in the schema — a new reference field added later
 * cannot silently escape the manifest.
 */
function collectRefs(value, docId, path, out) {
  if (Array.isArray(value)) {
    value.forEach((item, i) => collectRefs(item, docId, `${path}[${i}]`, out));
    return;
  }
  if (!value || typeof value !== "object") return;
  if (typeof value._ref === "string") {
    out.push({
      docId,
      path,
      ref: value._ref,
      refType: value._type ?? null,
    });
  }
  for (const [key, child] of Object.entries(value)) {
    collectRefs(child, docId, path ? `${path}.${key}` : key, out);
  }
}

/**
 * Capture every non-asset document plus the full reference graph, write it to
 * disk, then read it back and verify. Throws on any failure — the caller must
 * not proceed to write if this returns.
 */
async function createBackup() {
  console.log("backup");

  const documents = await client.fetch(
    `*[!(_type match "sanity.*")]{...}`,
    {},
    { perspective: "raw" },
  );

  if (documents.length === 0) {
    throw new Error(
      "Backup aborted: the dataset returned zero non-asset documents. " +
        "Refusing to continue.",
    );
  }

  const refs = [];
  for (const doc of documents) {
    collectRefs(doc, doc._id, "", refs);
  }

  const byId = new Map(documents.map((d) => [d._id, d._type]));
  const edges = refs.map((r) => ({
    ...r,
    targetType: byId.get(r.ref) ?? null,
    // A reference whose target is not in the manifest is either an asset
    // reference or an already-broken edge. Both are worth recording.
    targetInManifest: byId.has(r.ref),
  }));

  const payload = {
    format: "sanity-legacy-migration-backup",
    version: 2,
    createdAt: new Date().toISOString(),
    projectId,
    dataset,
    apiVersion,
    typeCounts: documents.reduce((acc, d) => {
      acc[d._type] = (acc[d._type] ?? 0) + 1;
      return acc;
    }, {}),
    integrity: {
      documentCount: documents.length,
      referenceCount: edges.length,
      unresolvedReferenceCount: edges.filter((e) => !e.targetInManifest).length,
    },
    edges,
    documents,
  };

  const serialised = JSON.stringify(payload, null, 2);
  const checksum = createHash("sha256").update(serialised).digest("hex");
  payload.integrity.checksumSha256 = checksum;

  await mkdir(dirname(BACKUP_PATH), { recursive: true });
  await writeFile(BACKUP_PATH, JSON.stringify(payload, null, 2), "utf8");

  // Verify: re-read from disk, parse, and re-derive the checksum from the
  // stored bytes. Anything less means the file on disk is not trustworthy.
  const raw = await readFile(BACKUP_PATH);
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `Backup verification FAILED: ${BACKUP_PATH} is not valid JSON (${err.message}). ` +
        "No changes have been made.",
    );
  }

  const { checksumSha256, ...restored } = parsed.integrity;
  const reDerived = createHash("sha256")
    .update(JSON.stringify({ ...parsed, integrity: restored }, null, 2))
    .digest("hex");

  const problems = [];
  if (parsed.format !== "sanity-legacy-migration-backup") {
    problems.push("unexpected format marker");
  }
  if (reDerived !== checksumSha256) {
    problems.push(`checksum mismatch (${reDerived} != ${checksumSha256})`);
  }
  if (parsed.integrity.documentCount !== parsed.documents.length) {
    problems.push(
      `documentCount ${parsed.integrity.documentCount} != ${parsed.documents.length} stored`,
    );
  }
  if (parsed.integrity.referenceCount !== parsed.edges.length) {
    problems.push(
      `referenceCount ${parsed.integrity.referenceCount} != ${parsed.edges.length} stored`,
    );
  }
  if (problems.length > 0) {
    throw new Error(
      `Backup verification FAILED for ${BACKUP_PATH}: ${problems.join("; ")}. ` +
        "No changes have been made.",
    );
  }

  console.log(`  ${BACKUP_PATH}`);
  console.log(`  ${parsed.integrity.documentCount} document(s), sha256 ${checksumSha256.slice(0, 12)}`);
  console.log(`  ${parsed.integrity.referenceCount} reference edge(s)`);
  console.log(
    `  ${parsed.integrity.unresolvedReferenceCount} edge(s) point outside the manifest (assets / already broken)`,
  );
  for (const [type, count] of Object.entries(parsed.typeCounts)) {
    console.log(`    ${type}: ${count}`);
  }
  return payload;
}

/**
 * Rename every document of `_type` `from` to `to`, in place.
 */
async function renameType({ from, to }) {
  const docs = await client.fetch(
    `*[_type == $from]{_id, _type, ...}`,
    { from },
    { perspective: "raw" },
  );

  if (docs.length === 0) {
    skip(`no documents with _type "${from}" — nothing to rename to "${to}"`);
    return;
  }

  for (const doc of docs) {
    await patchType({ _id: doc._id, from, to });
  }
  console.log(`  ${from} -> ${to}: ${docs.length} document(s)`);
}

// ---------------------------------------------------------------------------
// 1. tag -> techTag   (identical shape: label + iconImage)
// ---------------------------------------------------------------------------
async function migrateTechTags() {
  console.log("techTag");
  await renameType({ from: "tag", to: "techTag" });
}

// ---------------------------------------------------------------------------
// 2. category -> blogTag   (title is already the field name blogTag uses)
//    blogPost.categories holds _refs to these _ids, so an in-place _type
//    rewrite keeps every reference resolvable.
// ---------------------------------------------------------------------------
/**
 * Rename the legacy `category` documents to `blogTag`.
 *
 * `category.icon` has no home on `blogTag` and is deliberately NOT dropped
 * here — see `stripCategoryIcons`, which runs afterwards and reports exactly
 * what it removes. Keeping it as a separate step means the rename stays
 * reversible on its own.
 */
async function migrateBlogTags() {
  console.log("blogTag");
  const categories = await client.fetch(
    `*[_type == "category"]{_id, title, icon}`,
    {},
    { perspective: "raw" },
  );

  if (categories.length === 0) {
    skip('no documents with _type "category" — nothing to rename to "blogTag"');
    return;
  }

  for (const doc of categories) {
    await patchType({ _id: doc._id, from: "category", to: "blogTag" });
  }
  console.log(`  category -> blogTag: ${categories.length} document(s)`);
}

/**
 * Explicit, reported cleanup: drop the legacy `category.icon` field from the
 * documents that are now `blogTag`.
 *
 * Safety: each icon asset is also referenced by a `techTag` document, so
 * removing this field orphans no assets. The script re-checks that per asset
 * before unsetting, and refuses to unset if an asset would be left with zero
 * references.
 */
async function stripCategoryIcons() {
  console.log("blogTag icon cleanup");

  // Reads both the post-migration type and the legacy one, so the dry run
  // reports the real plan even though the rename has not happened yet.
  const docs = await client.fetch(
    `*[_type in ["blogTag", "category"] && defined(icon)]{_id, title, "asset": icon.imageFile.asset._ref}`,
    {},
    { perspective: "raw" },
  );

  if (docs.length === 0) {
    skip("no blogTag documents carry a legacy icon — nothing to strip");
    return;
  }

  for (const doc of docs) {
    if (!doc.asset) {
      warn(
        `blogTag "${doc.title}" (_id ${doc._id}) has an icon with no asset ` +
          "reference — skipped, strip it by hand.",
      );
      continue;
    }

    const otherRefs = await client.fetch(
      `count(*[!( _id == $id) && (
          iconImage.imageFile.asset._ref == $asset ||
          projectImage.imageFile.asset._ref == $asset ||
          mainImage.imageFile.asset._ref == $asset ||
          image.asset._ref == $asset
        )])`,
      { id: doc._id, asset: doc.asset },
      { perspective: "raw" },
    );

    if (otherRefs > 0) {
      console.log(
        `  ${doc.title}: icon asset ${doc.asset.slice(0, 28)}… kept ` +
          `(${otherRefs} other reference(s) — asset stays alive), field unset`,
      );
    } else {
      warn(
        `blogTag "${doc.title}": icon asset ${doc.asset} has no other ` +
          "reference — leaving the field in place so the asset is not orphaned.",
      );
      continue;
    }

    if (APPLY) {
      await client.patch(doc._id).unset(["icon"]).commit();
    }
  }

  console.log(`  icon field removed from ${docs.length} document(s)`);
}

// ---------------------------------------------------------------------------
// 3. profile -> myProfilePage singleton
// ---------------------------------------------------------------------------
async function migrateProfile() {
  console.log("myProfilePage");

  const legacy = await client.fetch(
    `*[_type == "profile"][0]{_id, fullName, headline, bio, image, uploadCV}`,
    {},
    { perspective: "raw" },
  );

  const authors = await client.fetch(
    `*[_type == "author"]{_id, fullName}`,
    {},
    { perspective: "raw" },
  );

  if (!legacy) {
    skip('no document with _type "profile" — create "myProfilePage" in the Studio instead');
    return;
  }

  // myProfilePage has no `headline` / `image` field. `headline` maps onto the
  // seo group; `bio` + `image` only have a home inside a `profileContent`
  // page-section block.
  const sections = [];

  if (legacy.bio || legacy.image) {
    if (!legacy.bio) {
      warn(
        `profile "${legacy.fullName}" has an "image" but no "bio"; ` +
          `profileContent.content is required, so the portrait cannot be ` +
          `migrated automatically. Re-add it as a Profile Content block in the Studio.`,
      );
    } else {
      sections.push({
        _key: "profileContentMigrated",
        _type: "profileContent",
        content: legacy.bio,
        image: legacy.image
          ? {
              _type: "customImage",
              imageFile: legacy.image,
              altText: legacy.fullName,
            }
          : undefined,
        imagePosition: "right",
      });
    }
  }

  const authorRef = authors[0]
    ? {
        _type: "reference",
        _ref: authors[0]._id,
        _weak: true,
        _key: "autherInfoMigrated",
      }
    : undefined;

  if (!authorRef) {
    warn(
      'no "author" document exists, so myProfilePage.autherInfo will be empty — ' +
        "the hero name and headline come from that reference.",
    );
  }

  const doc = {
    _id: "myProfilePage",
    _type: "myProfilePage",
    seo: {
      _type: "object",
      title: legacy.headline || legacy.fullName,
      description: "",
      slug: { _type: "slug", current: "" },
    },
    autherInfo: authorRef,
    pageSections: sections,
    uploadCV: legacy.uploadCV,
  };

  const existing = await client.getDocument("myProfilePage");

  if (existing) {
    skip(
      "myProfilePage already exists — left untouched. Delete it first if you " +
        "want the legacy profile re-imported.",
    );
    return;
  }

  if (APPLY) {
    await client.createIfNotExists(doc);
  }
  console.log(`  profile -> myProfilePage: created singleton from ${legacy._id}`);
  console.log(`    author ref: ${authorRef ? authors[0].fullName : "(none)"}`);
  console.log(`    pageSections: ${sections.length} block(s)`);
}

// ---------------------------------------------------------------------------
// 4. projectPage.projects  (the ordered list the Projects page builder needs)
// ---------------------------------------------------------------------------
async function migrateProjectPage() {
  console.log("projectPage");

  const existing = await client.getDocument("projectPage");
  if (existing) {
    skip("projectPage already exists — left untouched.");
    return;
  }

  const projects = await client.fetch(
    `*[_type == "project"]{_id, date, projectTitle} | order(coalesce(date, _createdAt) desc)`,
    {},
    { perspective: "raw" },
  );

  if (projects.length === 0) {
    skip('no documents with _type "project"');
    return;
  }

  const doc = {
    _id: "projectPage",
    _type: "projectPage",
    seo: {
      _type: "object",
      title: "Project",
      description: "",
      slug: { _type: "slug", current: "" },
    },
    projects: projects.map((p, i) => ({
      _type: "reference",
      _ref: p._id,
      _weak: true,
      _key: `projectMigrated${i}`,
    })),
  };

  if (APPLY) {
    await client.createIfNotExists(doc);
  }
  console.log(`  projectPage: created singleton ordering ${projects.length} project(s)`);
}

// ---------------------------------------------------------------------------
// 5. projectLink: legacy string / quoted-URL values -> real `link` objects
// ---------------------------------------------------------------------------
async function normaliseProjectLinks() {
  console.log("project.projectLink");

  const projects = await client.fetch(
    `*[_type == "project" && (!defined(projectLink._type) || projectLink._type == "link")]{
      _id, projectTitle, projectLink
    }`,
    {},
    { perspective: "raw" },
  );

  let patched = 0;

  for (const project of projects) {
    const raw = project.projectLink;

    // Shape 1: a bare string written before projectLink became a link field.
    if (raw && typeof raw === "string") {
      await setLink(project._id, stripQuotes(raw));
      patched += 1;
      continue;
    }

    // Shape 2: a link object whose url was stored with literal quote characters.
    if (raw?.url && stripQuotes(raw.url) !== raw.url) {
      if (APPLY) {
        await client
          .patch(project._id)
          .set({ "projectLink.url": stripQuotes(raw.url) })
          .commit();
      }
      patched += 1;
      warn(
        `project "${project.projectTitle}" had a quoted projectLink.url ` +
          `(${raw.url}) — unquoted.`,
      );
    }
  }

  if (patched === 0) {
    skip("all projectLink values are already link objects with clean urls");
  } else {
    console.log(`  normalised ${patched} projectLink value(s)`);
  }
}

// ---------------------------------------------------------------------------
// 6. Legacy block _types inside portable text arrays -> `customImage`
// ---------------------------------------------------------------------------
async function normalisePortableTextBlocks() {
  console.log("portableText block types");

  const counts = await client.fetch(
    `{"blogContent": count(*[_type == "blogPost"].blogContent[_type == "portableImage"]),
      "projectDescription": count(*[_type == "project"].projectDescription[_type == "portableImage"])}`,
    {},
    { perspective: "raw" },
  );

  if (counts.blogContent === 0 && counts.projectDescription === 0) {
    skip('no "portableImage" blocks left in any portable text array');
    return;
  }

  for (const [field, count] of [
    ["blogContent", counts.blogContent],
    ["projectDescription", counts.projectDescription],
  ]) {
    if (count === 0) continue;

    const docs = await client.fetch(
      `*[defined(${field}[_type == "portableImage"])]{_id, "keys": ${field}[_type == "portableImage"]._key}`,
      {},
      { perspective: "raw" },
    );

    if (APPLY) {
      for (const doc of docs) {
        // Patch paths support matching array items by `_key`, but not by an
        // arbitrary filter, so each block is renamed individually.
        for (const key of doc.keys) {
          await client
            .patch(doc._id)
            .set({ [`${field}[_key == "${key}"]._type`]: "customImage" })
            .commit();
        }
      }
    }
    console.log(`  portableImage -> customImage: ${count} block(s) in ${field}`);
  }

  // One blog post stored its mainImage with a capitalised type name.
  const misTyped = await client.fetch(
    `*[_type == "blogPost" && mainImage._type == "CustomImage"]{_id, blogTitle}`,
    {},
    { perspective: "raw" },
  );

  if (misTyped.length > 0) {
    for (const doc of misTyped) {
      if (APPLY) {
        await client
          .patch(doc._id)
          .set({ "mainImage._type": "customImage" })
          .commit();
      }
      warn(
        `blogPost "${doc.blogTitle}" had mainImage._type "CustomImage" ` +
          `(capital C) — normalised to "customImage".`,
      );
    }
  }
}

function stripQuotes(value) {
  return typeof value === "string" ? value.replace(/^"+|"+$/g, "") : value;
}

async function setLink(docId, url) {
  if (APPLY) {
    await client
      .patch(docId)
      .set({
        projectLink: {
          _type: "link",
          type: "external",
          url,
          blank: true,
          text: "",
        },
      })
      .commit();
  }
}

// ---------------------------------------------------------------------------
// 7. Report the things this script deliberately does not touch
// ---------------------------------------------------------------------------
function reportKnownGaps() {
  const gaps = [
    'aboutPage has no source content anywhere in the dataset — create it in the Studio (it is pinned under Pages).',
    'the legacy aboutPage.socialLinks array has no equivalent in the registered schema — re-add as a field, or use linkField.',
    'project.stack now declares to: [{type: "techTag"}]; the legacy references point at documents that are renamed to techTag by step 1, so they only resolve once step 1 has run.',
    'myProfilePage.uploadCV was null in the legacy profile document, so the "Download CV" button stays hidden.',
    'the legacy "profile" document is left in place; it becomes an orphan _type that the Studio renders in its fallback view. Delete it manually once the new singleton is verified.',
  ];
  for (const gap of gaps) warn(gap);
}

console.log(
  `\n${APPLY ? "APPLYING" : "DRY RUN"} migration on dataset "${dataset}" (project ${projectId})\n`,
);

// Hard gate: no write happens until a verified backup exists on disk.
if (BACKUP_PATH) {
  await createBackup();
  console.log("");
} else {
  console.log(
    "backup: skipped (pass --backup <path> to capture one)\n",
  );
}

await migrateTechTags();
await migrateBlogTags();
await migrateProfile();
await migrateProjectPage();
await normaliseProjectLinks();
await normalisePortableTextBlocks();
await stripCategoryIcons();
reportKnownGaps();

console.log("\n--- report ---");
if (report.skipped.length === 0 && report.notes.length === 0) {
  console.log("nothing to report.");
} else {
  for (const s of report.skipped) console.log(`  skipped: ${s}`);
  for (const n of report.notes) console.log(`  note:    ${n}`);
}

if (!APPLY) {
  console.log(
    "\nDry run only. Nothing was written to the dataset.\n" +
      "Next: create a backup, review it, then apply.",
  );
} else {
  console.log(
    `\nMigration complete. Rollback source: ${BACKUP_PATH}\n` +
      "See docs/c5-migration-plan.md for the rollback procedure.",
  );
}
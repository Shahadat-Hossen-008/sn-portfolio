# C5 migration plan — deployment order, acceptance checks, rollback

Companion to `scripts/migrate-legacy-content.mjs`. Read before running anything.

Nothing in this document has been executed. The dataset is untouched.

---

## 1. What C5 actually was

`project.stack` declared `to: [{type: "category"}]`, but `category` was registered
as an **object** type. A `reference` can only point at a **document**, so the field
was inert in the Studio.

Tracing the actual data showed the defect was **two bugs on one field**:

| | points at | status |
|---|---|---|
| `project.stack` schema declared | `category` (an object) | invalid target |
| `project.stack` data referenced | `tag` documents | not in the declared `to` list either |

The field could never resolve under either interpretation.

### Reference map (verified via `scripts/migrate-legacy-content.mjs --backup`)

```
blogPost.categories  ──13 edges──> category documents (7)   blog topics
project.stack        ──20 edges──> tag documents      (6)   technologies
                          ZERO cross-references
```

Per-target inbound edges:

| `category` (→ `blogTag`) | edges |   | `tag` (→ `techTag`) | edges |
|---|---|---|---|---|
| React `a5aab334…` | 3 | | React JS `cc5b8fda…` | 4 |
| JavaScript `c12918f5…` | 3 | | Node JS `0f4e5d2b…` | 4 |
| Blogging tips `076d130c…` | 2 | | Tailwind CSS `031ef59c…` | 4 |
| Next JS `0b0de3a1…` | 2 | | Firbase Auth `44687e89…` | 3 |
| Flutter `f7d36f97…` | 1 | | Mongo DB `254177cf…` | 3 |
| IOS `3229141b…` | 1 | | Git `69519d43…` | 2 |
| TypeScript `8438581c…` | 1 | | | |
| **total** | **13** | | **total** | **20** |

5 of the 11 `tag` documents have **zero** inbound project references — they exist
only to feed the homepage carousel (`TECH_QUERY` selects `*[_type == "techTag"][]`).

All 62 reference edges in the manifest resolve: 33 to documents, 29 to assets.
**Zero genuinely broken references.**

### Why the toolchain never caught this

```
npx sanity schema validate --level warning  →  Errors: 0   Warnings: 0
pnpm typegen                                 →  exit 0
```

Neither `schema extract` nor `schema validate` rejects `reference` → object.
TypeGen accepted it and emitted `[internalGroqTypeReferenceTo]?: "category"`, which
reads as harmless. **That marker is the only detection signal** — see §5 A8.

---

## 2. Schema changes applied (code only, zero data impact)

| Change | File |
|---|---|
| `project.stack` → `to: [{type: "techTag"}]` | `src/sanity/entites/project/index.ts` |
| object `category` → `technologyItem` | `src/sanity/_root/technology-item/index.ts` (git-mv'd from `_root/category/`) |
| section block members → `technologyItem` | `buildableSection/technologies/index.ts`, `buildableSection/carouselTech/index.ts` |
| registry import + array entry | `src/sanity/schemaTypes/index.ts` |
| doc comment | `src/sanity/lib/queries.ts` |

Both renames are **free of data impact**, verified before proceeding:

- `project.stack` had 0 resolvable targets, so changing its declared target breaks nothing.
- The `category` **object** type has zero live instances — `count(*[defined(pageSections)]) == 0`.
  The 7 `category` *documents* are unrelated and are untouched by the rename.

The rename also removes the name collision that caused the confusion: `category`
meant an object in the schema while the same word meant blog tags in the data.

---

## 3. Deployment order — **schema-first is NOT safe**

The intuitive assumption is "ship the schema, then migrate the data." That is wrong
here, and it is worth being explicit about why.

### What schema deployment does

`pnpm build` / `pnpm dev` do **not** push the schema to the dataset. Sanity only
validates it locally. The Studio reads `sanity.config.ts` at runtime, so simply
running the Studio with the new schema is what changes what editors see.

### Why schema-first still leaves a broken window

Suppose the schema ships first and an editor opens the Studio before the data
migration runs:

| document | data `_type` | in new schema? | Studio behaviour |
|---|---|---|---|
| 11 technology docs | `tag` | ✗ removed | renders in the fallback view; **editable and publishable** as an unknown type |
| 7 blog topic docs | `category` | ✗ removed (now an *object*) | same |
| 4 projects | `project` | ✓ | `stack` refs resolve against `techTag`, which **has 0 documents** → all 20 edges unresolved |
| 6 blog posts | `blogPost` | ✓ | `categories` refs resolve against `blogTag`, which **has 0 documents** → all 13 edges unresolved |

The trap: an unresolved reference is **not read-only**. The Studio will happily let
an editor re-pick or clear a broken reference and publish it. If that happens before
the migration, `_id`s can be repointed at wrong documents, and the in-place rename
that step 7/8 depend on no longer matches reality.

### Recommended order: **data first**

```
1.  node scripts/migrate-legacy-content.mjs                      # dry run
2.  node scripts/migrate-legacy-content.mjs --backup <path>      # backup
3.  review <path>                                                  # human gate
4.  node scripts/migrate-legacy-content.mjs --backup <path> --apply
5.  pnpm typegen  &&  pnpm build                                  # schema deploy
6.  open the Studio and verify
```

Data-first is safe because every step is an **in-place `_type` rewrite keyed by `_id`**,
so no reference is ever repointed. Going data-first means the Studio briefly shows the
*new* content types as unknown, which is a cosmetic fallback view — strictly less
damaging than 33 resolvable-looking references that an editor can silently break.

### If you must deploy the schema first

1. `sanity schema deploy` is **not** what is needed here — that pushes an extract for
   API validation and will not prevent the issue.
2. Freeze Studio access for the migration window (deploy to a branch, or don't deploy).
3. Accept that `project.stack` and `blogPost.categories` show unresolved references
   until step 4 completes, and that **editors must not publish during the window**.
4. Run the A1–A7 acceptance checks immediately after step 4, before reopening the Studio.

---

## 4. Idempotency and recovery

### Idempotent: yes

Every step is a no-op on re-run, because each guard keys off a post-condition:

| step | re-run behaviour |
|---|---|
| `tag` → `techTag` | 0 docs match → "nothing to rename" |
| `category` → `blogTag` | 0 docs match → "nothing to rename" |
| `myProfilePage` | `getDocument()` exists → skip |
| `projectPage` | same |
| `projectLink` normalisation | already an object, url unquoted → no patch |
| `portableImage` → `customImage` | count 0 → skip |
| icon cleanup | 0 docs with `icon` → skip |

### Recovery: backup-gated, and the gate is enforced

`--backup <path>` is **mandatory** with `--apply`. The script throws before any write
if:

- `--apply` is passed without `--backup`
- `--backup` has no value, or the next arg is another flag
- the dataset returns zero non-asset documents
- the backup path cannot be created (`mkdir` fails)
- the written file is not valid JSON on re-read
- the re-derived SHA-256 does not match
- `documentCount` / `referenceCount` disagree with the stored arrays

Each of these exits non-zero with **"No changes have been made."**

Why this is necessary: the dataset has **zero drafts**
(`count(*[_id in path("drafts.**")]) == 0`), and Sanity patches do not create drafts.
A `_type` rewrite leaves no `_rev` trail, so there is no server-side undo. The backup
file is the only rollback source.

The backup stores **all 31 non-asset documents in full** (not just the ones being
renamed), plus every reference edge with its exact path and resolved target type.
Edges are walked in JS rather than GROQ, so a reference field added to the schema
later cannot silently escape the manifest.

---

## 5. Acceptance checks

Run A1–A7 **after** `--apply`. They need a read token; A8–A10 can run today.

| # | check | expected | needs token |
|---|---|---|---|
| A1 | `count(*[_type=="techTag"])` | `11` | read |
| A2 | `count(*[_type=="blogTag"])` | `7` | read |
| A3 | `count(*[_type=="tag"])` / `[_type=="category"]` | `0` / `0` | read |
| A4 | every `project.stack[]._ref` resolves to a `techTag` | 20/20, 0 unresolved | read |
| A5 | every `blogPost.categories[]._ref` resolves to a `blogTag` | **13/13**, 0 unresolved | read |
| A6 | per-target inbound edges match the §1 tables | 20 + 13 | read |
| A7 | each of the 4 shared icon assets still has ≥1 reference | 4/4 | read |
| A8 | `types.ts` `Project.stack` marker | `?: "techTag"` | none |
| A9 | `types.ts` — no `Array<never>`, no `null` for `TECH_/BLOG_/PROJECT_QUERYResult` | 0 occurrences | none |
| A10 | `pnpm build` | pass | none |
| A11 | `TECH_QUERY` row count | `11` (carousel unchanged) | read |
| A12 | Studio: `project.stack` reference input offers 11 `techTag` docs | manual | none |
| A13 | re-run the migration dry run | all steps report "skipped", 0 writes | read |

A4/A5 in GROQ:

```groq
{
  "stackUnresolved":  count(*[_type=="project"].stack[!(_ref in *[_type=="techTag"]._id)]),
  "categoryUnresolved": count(*[_type=="blogPost"].categories[!(_ref in *[_type=="blogTag"]._id)])
}
```
Both must be `0`.

A8 — the only guard against a reintroduced reference→object bug, given that
`schema validate` and `typegen` both pass it silently. Check the general property,
not just the one field: **no reference marker may name an object type.**

```bash
pnpm typegen && git diff --exit-code src/sanity/types.ts   # committed types must be current
```

Every `internalGroqTypeReferenceTo` value must be a document type. Current output:

```
line  33: "sanity.imageAsset"     line 195: "myProfilePage"
line  70: "project"               line 223: "blogTag"
line 182: "techTag"               line 242: "author"
line 250: "sanity.fileAsset"
```

Object types (`technologyItem`, `customImage`, `richTextSection`, `youtube`, …) must
**never** appear here. A new one means a `reference` is pointing at an object.

---

## 6. Rollback

**Only possible if a verified backup exists.** Take one before `--apply`; step 2 of §3
makes this a hard gate.

### Preferred — full dataset restore

```bash
sanity dataset export production snapshot-before-c5.ndjson --ids ...
sanity dataset import production snapshot-before-c5.ndjson
```
Total downtime, restores drafts and history, independent of this script.

### Targeted reversal, driven by the manifest

1. Rename back: `blogTag` → `category`, `techTag` → `tag`, using the `_id` list from
   `documents[]._id` grouped by `_type` in the backup.
2. Delete the singletons the migration created: `myProfilePage`, `projectPage`.
3. Restore `projectLink` for the 5 affected projects from `documents[].projectLink`.
4. Restore `blogContent[_key == "…"]._type` for the 2 `portableImage` blocks, and
   `mainImage._type` for the 1 `CustomImage` document.
5. Re-run `pnpm typegen` and `pnpm build` after reverting the schema commit.

### Rollback is one-way without a backup

Without a backup there is no way to recover the pre-migration `_id`↔`_type`
assignment from the dataset alone, and no `_rev` trail to reconstruct it from.
This is the entire reason `--backup` is mandatory rather than advisory.

---

## 7. Known gaps carried forward

- `project.stack` still references `category`-era data for **1 of 5** projects
  (`b17244ce`, "Paws & Peddy") which has `stack: null` and a suspicious
  `_createdAt` of 2026-04-20. Assumed to be an intentional empty state, **not verified**.
- The legacy `profile` document is **not** deleted by the migration; it becomes an
  orphan `_type` in the Studio fallback view. Delete manually after verifying the
  new singleton.
- `category.link` was observed empty on all 7 documents; not exhaustively confirmed.
- `techTag` and `blogTag` overlap semantically for JavaScript / TypeScript / Next JS /
  React (same icon asset, slightly different labels). Kept separate deliberately —
  see §1 of the C5 investigation. Consolidating is a content decision, not a schema one.
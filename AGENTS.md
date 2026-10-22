# AGENTS.md

Working notes for AI agents (and humans) touching this repository.
Read this before writing code. It describes what the project *is*, how it is
laid out, the conventions that are actually followed, and the traps that will
bite you.

---

## 1. What this project is

A personal developer portfolio: **Next.js 16 (App Router) + React 19 + Sanity
Studio**, both hosted in the *same* Next.js app.

| Piece | Detail |
|---|---|
| Framework | Next.js `16.1.6`, App Router, React `19.2.3`, TypeScript strict |
| Styling | Tailwind CSS **v4**, CSS-first config (`@theme` in `src/app/globals.css`). **No** `tailwind.config.*` |
| CMS | Sanity `^4.22`, `next-sanity` `^11.6`, Studio mounted at `/studio` |
| Data | `defineLive()` + `<SanityLive />` (live content API). No `generateStaticParams`, no `revalidate`, no `unstable_cache` |
| Extras | `react-hook-form` + `react-toastify` + nodemailer server action, `framer-motion`, `styled-components` (unused), Embla carousels, `@portabletext/react` |
| Package manager | pnpm (`pnpm-lock.yaml`, `pnpm-workspace.yaml`) |
| Path alias | `@/*` → `./src/*` |

---

## 2. Commands

```bash
pnpm dev       # runs `typegen` first via predev, then next dev
pnpm build     # runs `typegen` first via prebuild, then next build
pnpm lint      # eslint (stock eslint-config-next, flat config)
pnpm test      # helpers, components, schema registration and structure; no live dataset
pnpm typegen   # sanity schema extract + sanity typegen generate
```

`predev` and `prebuild` run TypeGen before Next.js starts/builds;
`sanity.cli.ts` does not enable automatic TypeGen for Sanity CLI commands.
Run `pnpm typegen` manually after schema or GROQ changes when you need refreshed
types outside those Next.js lifecycle scripts.

`typegen` regenerates **two committed files**:

- `src/sanity/extract.json` — the extracted schema
- `src/sanity/types.ts` — generated schema + query-result types

Both are committed and **must be committed together** with any schema change.
A schema/query change without regenerating them is a bug.

---

## 3. Architecture

### 3.1 Two apps in one Next.js tree

```
src/app/layout.tsx                 root shell (html/body); no metadata
src/app/(frontend)/                public site — route group, no URL segment
  layout.tsx                       layout + settings queries → <Navbar/> <Footer/> <SanityLive/> GTM, generateMetadata
  page.tsx                         home: PROFILE + ABOUT + TECH + PROJECT
  blog/page.tsx
  blog/[slug]/page.tsx
src/app/studio/[[...tool]]/page.tsx   Sanity Studio (export const dynamic = 'force-static')
src/app/actions/sendEmail.ts       "use server" contact-form action
src/app/types/                     hand-written prop-bag types derived from generated types
src/components/<feature>/          PascalCase .tsx, one feature folder each
src/emails/                        @react-email templates
src/sanity/                        Studio config + schema + frontend data layer
sanity.config.ts                   root Studio config (imported by the /studio route)
utils/                             DEAD duplicate of src/sanity/utils — do not use
```

### 3.2 `src/sanity/` — two distinct concerns in one folder

**Studio side (schema):**

| Folder | Contents |
|---|---|
| `_root/` | Shared primitives: `media/` (`customImage`), `portableText/`, `sections/` (`pageSections`), `seo/` (+`slug/`), `link/`, `nav-link/`, `technology-item/` |
| `global/` | Singletons: `siteSettings/` (SEO / analytics), `layout/` (identity / header / footer) |
| `entites/` | Referenced content records: `author`, `blogPost`, `project` (note: folder is misspelled `entites`) |
| `pages/` | Singleton page documents: `profilePage` (`myProfilePage`), `aboutPage`, `projectPage` |
| `buildableSection/` | Composable page blocks: `profileContent`, `technologies`, `richText`, `carouselTech` |
| `miscellaneous/` | Loose leaf docs: `blogTag`, `techTag` |
| `structure/` | Custom Studio sidebar (one module per top-level group) + `utils/create-document-structure.ts` |
| `components/` | Custom Studio input components (`slug-input`) |
| `schemaTypes/index.ts` | **The registry.** Everything must be registered here or it does not exist |
| `env.ts`, `utils/` | Studio-side helpers |

**Frontend side (data):** `lib/client.ts`, `lib/live.ts`, `lib/queries.ts`,
`lib/image.ts`, plus the pure helpers `lib/routes.ts`, `lib/links.ts`,
`lib/metadata.ts`, `lib/analytics.ts`. Older `lib/*.ts` use single quotes / no
semicolons; newer ones use double quotes + semicolons to match the rest of the
repo. Either is accepted in `lib/`; be consistent within a file.

### 3.3 Registration is the source of truth

`src/sanity/schemaTypes/index.ts` exports five arrays — `globalSchemas`,
`entities`, `hoistedObjects`, `fixedPages`, `miscellaneous` — spread into
`schema.types`. A schema file that is not in one of those arrays **does not
exist** to Sanity, to `typegen`, or to GROQ.

The same file also exports `schema.templates` (singletons are filtered out of
the create-new menu) and `singletonDocumentActions` (delete/duplicate are blocked
for singletons only). `sanity.config.ts` wires the latter into
`document.actions`.

### 3.4 Data flow

`page.tsx` → `sanityFetch({ query, params })` (`defineLive`) → typed by
`defineQuery` against generated `SanityQueries` → passes **plain serializable
props** down to components. **Components never fetch.** `components/**` contains
zero imports of `sanityFetch`/`client`.

`LAYOUT_QUERY` is fetched for metadata and layout rendering in
`src/app/(frontend)/layout.tsx`; the render result is passed to `<Navbar>` /
`<Footer>` as props. `SITE_SETTINGS_QUERY` is fetched for metadata and
analytics. Components never fetch either singleton.

Client/server split is by interactivity only:

- `"use client"`: `contact/Form.tsx`, `navbar/Navbar.tsx`, `projects/Project.tsx`,
  `technology/Technology.tsx`, `youTube/YouTube.tsx` (carousels, hooks, forms)
- `"use server"`: `app/actions/sendEmail.ts`
- everything else: RSC

### 3.5 Studio sidebar

`src/sanity/structure.ts` composes: **[pinned singletons]** (divider) **Pages**
(divider) **Entities** (divider) **Miscellaneous**. Singletons (`siteSettings`,
`layout`, and the fixed pages) are pinned via
`structure/utils/create-document-structure.ts` (`S.document().documentId(typeName)`),
which is why the `[0]` in the page and settings queries is safe.

### 3.6 Site settings

`siteSettings` and `layout` are separate pinned documents (`_id` equals each
schema name):

- `layout.identity` — `siteTitle`, `siteDescription`, `logo` (customImage;
  `altText` is the logo alt), `favicon`, `socialLinks[]` (shared by header/footer)
- `layout.header` — `links[]` (`link`), `cta` (`link`), `showSocialLinks`
- `layout.footer` — `mainContent`, `email`, `phone`, `columns[]` (`link`),
  `base`
- `siteSettings.seo` — `titleTemplate` (`{title}` placeholder),
  `defaultOgImage`, `robots`
- `siteSettings.analytics` — `googleTagManagerID` (must match `^GTM-[A-Z0-9]+$`)

`layout.footer.columns` is a flat array of `link` objects. Keep its GROQ
projection and Footer consumer flat, and resolve each href through
`resolveLink()` so invalid or unroutable entries are omitted.

Two rules that are easy to break:

1. **Nothing is guaranteed to exist.** The document is created by hand in the
   Studio; `SITE_SETTINGS_QUERY` returns `null` until then. The navbar and footer
   render nothing in that state and `buildMetadata` falls back to built-in
   defaults. Every consumer null-checks.
2. **Routes are declared, not inferred.** Resolution for internal `link`
   references goes through `ROUTES_BY_TYPE` in `src/sanity/lib/routes.ts`,
   which is the single source of truth for both the Studio `reference.to` list
   and the frontend href. `aboutPage` / `projectPage` are **absent** because
   those routes do not exist yet — linking to them is impossible until the route
   is added there.


---

## 4. Conventions to follow

**Naming**

- Components: `PascalCase.tsx`, one per feature folder (`components/about/About.tsx`).
  Export default; named export only when there is no component (e.g. the
  `portableTextComponents` map). Existing function names deviate in places
  (`Blog.tsx` → `Blogs`, `Image.tsx` → `SanityImage`); prefer filename match for
  new files.
- Studio schema files: each type is `index.ts` in its own folder, exporting a
  single `defineType` const. Follow the folder layout above.
- GROQ query consts: `SCREAMING_SNAKE` in `lib/queries.ts`, always wrapped in
  `defineQuery`.
- Props types: `src/app/types/*.ts`, lowercase-ish names (`aboutProps`,
  `projectProps`) or PascalCase (`ProfileProps`) — both exist, be internally
  consistent in the file you touch.
- Prefer `@/...` imports. `../../../../` relative imports exist (studio route)
  but should not be copied.

**Studio schema idioms already in use**

- `seo()` factory from `_root/seo` gives every page a `seo` group (title,
  description, slug). Always pass it to a page.
- `slug({ source, isFixed, prefix })` factory renders a **live URL preview** and
  can lock the slug (`isFixed: true` hides the editable field).
- `pageSections` array on `aboutPage`/`profilePage` is the page body builder:
  drop `profileContent` / `richTextSection` / `technologySection` /
  `technologyCarousel` / `customImage` blocks into it.
- For new schema arrays, use `defineArrayMember()` for each `of` member; older
  definitions may still use shorthand, so avoid unrelated churn.
- Preview via `preview.select` + `prepare`; icon-as-media (`media: SomeIcon`)
  is idiomatic here.
- `defineField(..., { strict: false })` is used deliberately to extend intrinsic
  types (e.g. slug options) — not an accident.

**Styling**

- Tailwind utilities inline. Theme tokens come from `@theme` in `globals.css`:
  `--color-primary` (`bg-primary/20`, `border-primary/20`, …), `--font-display`,
  `--breakpoint-3xl`. Use the tokens, don't hardcode the hex.
- `globals.css` is imported by both layouts — leave it that way unless you're
  deliberately deduplicating.
- Fonts are loaded by CSS `@import` (Urbanist), **not** `next/font`. The root
  `README.md` claiming Geist is stale boilerplate.

---

## 5. Traps — read before you touch these

### 5.2 GROQ queries vs the schema

The registry and source queries must be checked as separate contracts:
`src/sanity/schemaTypes/index.ts` is the schema registry, while
`src/sanity/lib/queries.ts` is the frontend projection contract. A query can
target a registered type and still project fields that do not exist in its
schema. Generated types can also be stale: the checked-in
`src/sanity/types.ts` currently maps an older `LAYOUT_QUERY` (no `header.cta`,
flat footer links), while the source query includes `header.cta` and projects
`footer.columns` as `{title, links[]}`. Regenerate with `pnpm typegen` after
schema/query edits and review the actual result types; do not trust a successful
TypeScript check alone.

When a query targets an unregistered `_type`, its result can collapse to `null`
or `Array<never>`, and `never` may silently permit arbitrary property access.
Always confirm that each generated `*Result` has the intended shape.

Other verified schema/query considerations:

- `blogPost` **is** registered (`entites/blogPost`), and now carries its own
  `seo` object (`includeSlug: false` — its route slug stays on the top-level
  `slug` field). The old claim that it was orphaned was wrong.
- `PROFILE_QUERY`, `ABOUT_QUERY`, `TECH_QUERY`, and `PROJECT_QUERY` target
  registered types. Whether they currently return documents depends on the
  configured dataset; source inspection cannot establish live dataset contents.
- `blogPost.author` is a plain string even though an `author` document type
  exists and the profile page references it. If authors should be reusable on
  posts, changing this to a reference requires a content migration and query /
  frontend updates; do not change the field shape silently.
- `BLOG_POSTS_QUERY` returns every post without ordering or pagination, and
  includes each full `blogContent` body although the list only visually
  line-clamps the rendered content. This is acceptable only while the content
  set is small; consider a dedicated excerpt, smaller projection, deterministic
  order, and pagination as the blog grows.
- The homepage awaits four independent Sanity queries sequentially. Use
  `Promise.all()` for independent fetches rather than adding a network
  waterfall.

### 5.3 Dead / legacy code — do not build on it

- The former duplicate YouTube preview under `schemaTypes/preview/` was
  unreferenced and removed; the registered YouTube type still uses the preview
  under `_root/portableText/iframe/renderComponents`.
- `src/sanity/_root/seo/slug/restricted-slugs.ts` — the guard checks
  `_type == "generalPage"`, a type that doesn't exist, and every caller passes
  `isFixed: true` which short-circuits it. Fully unreachable.
- `src/components/image/NextImage.tsx` — zero call sites in the current source
  tree.
- `utils/get-base-url.ts`, `utils/type.ts` — byte-identical duplicates of
  `src/sanity/utils/*`, imported by nothing.
- Root `schema.json` — stale artifact, not produced by any script.
- Unused deps: `styled-components`, `framer-motion`, `pluralize`,
  `@tailwindcss/typography` (plugin registered, no `prose` class used).

### 5.4 Portable Text: schema ↔ renderer must be changed together

`src/components/portableText/PortableTextComponent.tsx` is
`Partial<PortableTextReactComponents>`. The renderer is wired to the schema's
`linkUrl` annotation, `customImage.altText`, code blocks, blockquotes, and the
`youtube` object. Keep the schema, GROQ projections, and renderer aligned:

- Project, blog, and about Portable Text query projections expand internal
  references to the `_type` and slug required by `resolveLink()`.
- The legacy `portableImage` block currently present in blog content has the
  same confirmed `imageFile` / `altText` shape as `customImage`; both render
  through the guarded image renderer.
- Malformed/unresolved links and unsupported image/video values are omitted or
  rendered as plain text; no fallback `href="#"` is used.

`PreviewPortableText.tsx` is a second, untyped map used only by the blog list.

`pageSections` has no general frontend renderer. The homepage queries only
selected fields/blocks (`ABOUT_QUERY` extracts rich text and technology items;
`PROFILE_QUERY` omits its sections), so arbitrary page-builder content entered
in the Studio does not automatically appear on the site.

### 5.5 Contact form (`app/actions/sendEmail.ts`)

Server action, no runtime validation, no rate limit, no sanitization, errors
swallowed without logging. `replyTo` uses raw user input (header-injection
vector). Env vars are read without the `assertValue` guard that
`src/sanity/env.ts` already provides — reuse it if you touch this. The
transporter is constructed per invocation, defeating `pool: true`.

Don't copy this pattern for new server actions.

### 5.6 Other easy-to-hit runtime errors

- `format(parseISO(...))` throws `RangeError` on `undefined`/empty dates
  (`Project.tsx`; `blog/[slug]/page.tsx` uses the guarded `formatDate` helper)
- `project.projectLink` is a **link object**, not a string
- `.map` on possibly-null query results (`Technology.tsx`)
- `parseISO` imported from `date-fns/fp` in `Project.tsx` — wrong submodule
- image transforms are inconsistent; three call sites pass `unoptimized`, two
  pass no dimensions at all

**Dataset state is not established by the source tree.** Do not assume a live
dataset is empty or contains a particular set of documents based on an old
snapshot. The schema defines types, not content. Handle singleton queries as
nullable and verify the configured dataset through the authorized Sanity
environment when content presence matters. `SITE_SETTINGS_QUERY` returning
`null` is a supported state, not by itself a schema error.

`NEXT_PUBLIC_SANITY_API_VERSION` optionally overrides the API version; the
current fallback is `2026-03-02`. `defineLive()` is configured with only the
public client (no read token, draft mode, or Presentation/Visual Editing
configuration), and `<SanityLive />` is rendered in the public frontend layout.

### 5.7 Naming inconsistencies (don't propagate them)

`entites/` (typo) · `pageSection` const for `pageSections` `_type` ·
`structure.ts` file vs `structure/` dir ·
`"Duretion:"` in `Project.tsx`. Fix in place when you touch the file; don't add
more.

---

## 6. How to make a change safely

**Adding a document type**

1. Create `src/sanity/<global|entites|pages|miscellaneous>/<name>/index.ts`
   with `defineType`.
2. Register it in `src/sanity/schemaTypes/index.ts` in the right array
   (`globalSchemas` for singletons, `entities` for referenced records, …).
3. If it's a singleton page: add `seo()` and wire it into
   `structure/pages/index.ts` so it appears pinned in the sidebar. If it's a
   *global* singleton, add it to `globalSchemas` instead — it is then pinned at
   the top of the sidebar and automatically excluded from `schema.templates` and
   `singletonDocumentActions`.
4. Add a `defineQuery` const in `src/sanity/lib/queries.ts`.
5. Run `pnpm typegen`; check the new `*Result` type in `src/sanity/types.ts` is
   a real shape and **not** `null` / `Array<never>`.
6. Commit `extract.json` + `types.ts` with the change.

**Adding a route**

Frontend routes and CMS internal links are wired together in exactly one place:
`ROUTES_BY_TYPE` in `src/sanity/lib/routes.ts`. Adding an entry there does two
things at once — the frontend can resolve the new `_type` to an href, and the
Studio `link` `reference` field starts offering that document type. Until the
entry exists, an internal link to that document type is impossible (and any
stale link resolves to `null` and is dropped rather than rendered dead).

**Adding a page-section block**

1. Create the object type under `src/sanity/buildableSection/<name>/index.ts`.
2. Add it to `hoistedObjects` in `schemaTypes/index.ts`.
3. Add it to the `of` array **and** the `insertMenu.groups` in
   `_root/sections/index.ts`.
4. Give it a `preview` — several section types have none and render
   identically in the desk.
5. If the frontend should render it, add a branch to
   `PortableTextComponent.tsx` or a new `pageSections` renderer.

**Before you finish**

```bash
pnpm test       # helpers, components, schema registration and structure; no live dataset
pnpm lint
pnpm build      # typegen + next build; catches TS2305-class registry errors
```

`pnpm build` is the real gate. `pnpm lint` alone will not catch schema/query
drift. `pnpm test` compiles the registered schema and exercises singleton
structure logic with a local stub, but it does **not** query Sanity or prove
that live CMS content renders.

---

## 7. Reference docs in-repo

- `docs/blog-rendering.md` — how the blog routes render (accurate but incomplete:
  it does not mention `revalidate: false` in production or the `blogPost` seo object)
- `src/components/contact/Email.FLow.md` — mail flow, the three env vars, and the
  intentional-ish `MAIL_RECIEVER_ADDRESS` misspelling
- `src/components/image/imagePerformance.readme.md` — `<picture>` vs `next/image`
  comparison, with a TODO list of follow-up snippets
- `next-sanity` live-content docs: <https://github.com/sanity-io/next-sanity>
- Sanity structure builder cheat sheet: <https://www.sanity.io/docs/structure-builder-cheat-sheet>

**Env vars** (`.env.local`, gitignored): `NEXT_PUBLIC_SANITY_PROJECT_ID`,
`NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SMTP_USER`,
`SMTP_PASSWORD`, `MAIL_RECIEVER_ADDRESS`,
`NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_DEVELOP`,
`NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_PRODUCTION`. There is **no** read token,
draft mode, or Visual Editing preview integration — `defineLive` is configured
with only `client`.

`NEXT_PUBLIC_SITE_URL` (e.g. `https://shahadat.dev`) is optional but recommended:
it is the origin used for canonical URLs and `metadataBase` in
`src/sanity/lib/metadata.ts`. Without it (or Vercel's
`VERCEL_PROJECT_PRODUCTION_URL`) canonical URLs are omitted rather than guessed.
The `..._STUDIO_PREVIEW_URL_*` vars are **not** used for this — they point at
`/studio`.
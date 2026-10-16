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
pnpm test      # vitest run — pure helpers only, never touches Sanity
pnpm typegen   # sanity schema extract + sanity typegen generate
```

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
  layout.tsx                       SITE_SETTINGS_QUERY once → <Navbar/> <Footer/> <SanityLive/> GTM, generateMetadata
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
| `_root/` | Shared primitives: `media/` (customImage), `portableText/`, `category/`, `sections/` (`pageSections`), `seo/` (+`slug/`), `nav-link/` (`navLink`), `footer-column/` (`footerColumn`) |
| `global/` | Singletons: `siteSettings/` (identity / header / footer / seo / analytics) |
| `entites/` | Referenced content records: `author`, `blogPost`, `project` (note: folder is misspelled `entites`) |
| `pages/` | Singleton page documents: `profilePage` (`myProfilePage`), `aboutPage`, `projectPage` |
| `buildableSection/` | Composable page blocks: `profileContent`, `technologies`, `richText`, `carouselTech` |
| `miscellaneous/` | Loose leaf docs: `blog-tag/`, `tech-tag/` (kebab-case, unlike everything else) |
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

`SITE_SETTINGS_QUERY` is fetched **once** in `src/app/(frontend)/layout.tsx` and
passed to `<Navbar>` / `<Footer>` as props. Nothing else may fetch it.

Client/server split is by interactivity only:

- `"use client"`: `contact/Form.tsx`, `navbar/Navbar.tsx`, `projects/Project.tsx`,
  `technology/Technology.tsx`, `youTube/YouTube.tsx` (carousels, hooks, forms)
- `"use server"`: `app/actions/sendEmail.ts`
- everything else: RSC

### 3.5 Studio sidebar

`src/sanity/structure.ts` composes: **[pinned singletons]** (divider) **Pages**
(divider) **Entities** (divider) **Miscellaneous**. Singletons (currently
`siteSettings`) are pinned via
`structure/utils/create-document-structure.ts` (`S.document().documentId(typeName)`),
which is why the `[0]` in the page and settings queries is safe.

### 3.6 Site settings

`siteSettings` is a single pinned document (`_id === "siteSettings"`) holding
site-wide defaults:

- `identity` — `siteTitle`, `siteDescription`, `logo` (customImage; `altText` is
  the logo alt), `favicon`, `socialLinks[]` (shared by header and footer)
- `header` — `links[]` (`navLink`), `cta` (`navLink`), `showSocialLinks`
- `footer` — `mainContent`, `email`, `phone`, `columns[]` (`footerColumn`), `base`
- `seo` — `titleTemplate` (`{title}` placeholder), `defaultOgImage`, `robots`
- `analytics` — `googleTagManagerID` (must match `^GTM-[A-Z0-9]+$`)

Two rules that are easy to break:

1. **Nothing is guaranteed to exist.** The document is created by hand in the
   Studio; `SITE_SETTINGS_QUERY` returns `null` until then. The navbar and footer
   render nothing in that state and `buildMetadata` falls back to built-in
   defaults. Every consumer null-checks.
2. **Routes are declared, not inferred.** `RESOLUTION` for internal `navLink`
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

As of the site-settings work the registered types and the queries agree. The
generated result types in `src/sanity/types.ts` are a real shape — check them
after every `typegen` run, because when a query targets an unregistered `_type`
the result collapses to `null` / `Array<never>` and `never` silently allows
arbitrary property access, so **TypeScript stops complaining while the page
renders nothing.**

Two behaviours to hold onto:

- `blogPost` **is** registered (`entites/blogPost`), and now carries its own
  `seo` object (`includeSlug: false` — its route slug stays on the top-level
  `slug` field). The old claim that it was orphaned was wrong.
- `PROFILE_QUERY` / `ABOUT_QUERY` / `TECH_QUERY` / `PROJECT_QUERY` all target
  registered types. They return `null` / `[]` because the dataset is **empty of
  those documents** (see 5.6), not because the types are missing.

### 5.3 Dead / legacy code — do not build on it

- `src/sanity/schemaTypes/{about,blogType,profile}.ts` and
  `src/sanity/schemaTypes/preview/**` — orphaned (not in the registry). They are
  the *specification the old GROQ was written against*. The registry now imports
  from `global/`, `entites/`, `pages/`, `buildableSection/`, `_root/` and
  `miscellaneous/` only.
- `src/sanity/_root/seo/slug/restricted-slugs.ts` — the guard checks
  `_type == "generalPage"`, a type that doesn't exist, and every caller passes
  `isFixed: true` which short-circuits it. Fully unreachable.
- `src/components/image/NextImage.tsx` — zero call sites (imported, never
  rendered, in `Profile.tsx:5`).
- `utils/get-base-url.ts`, `utils/type.ts` — byte-identical duplicates of
  `src/sanity/utils/*`, imported by nothing.
- Root `schema.json` — stale artifact, not produced by any script.
- Unused deps: `styled-components`, `framer-motion`, `pluralize`,
  `@tailwindcss/typography` (plugin registered, no `prose` class used).

### 5.4 Portable Text: schema ↔ renderer must be changed together

`src/components/portableText/PortableTextComponent.tsx` is
`Partial<PortableTextReactComponents>`. Existing bugs to be aware of:

- link annotation is declared `name: "linkUrl", type: "link"`; the renderer reads
  `value.href.href` → falls back to `"#"`
- `customImage` field is `altText`; the renderer reads `alt` → alt is always empty
- `code` blocks have **no** renderer
- `blockquote` has no renderer
- hardcoded `target="_blank"` breaks `linkField` internal links

`PreviewPortableText.tsx` is a second, untyped map used only by the blog list.

`pageSections` currently has **no frontend renderer at all** — content built in
the Studio through it does not appear on the site.

### 5.5 Contact form (`app/actions/sendEmail.ts`)

Server action, no runtime validation, no rate limit, no sanitization, errors
swallowed without logging. `replyTo` uses raw user input (header-injection
vector). Env vars are read without the `assertValue` guard that
`src/sanity/env.ts` already provides — reuse it if you touch this. The
transporter is constructed per invocation, defeating `pool: true`.

Don't copy this pattern for new server actions.

### 5.6 Other easy-to-hit runtime errors

- `format(parseISO(...))` throws `RangeError` on `undefined`/empty dates
  (`Project.tsx`, `blog/[slug]/page.tsx`)
- `project.projectLink` is a **link object**, not a string
- `.map` on possibly-null query results (`Technology.tsx`)
- `parseISO` imported from `date-fns/fp` in `Project.tsx` — wrong submodule
- image transforms are inconsistent; three call sites pass `unoptimized`, two
  pass no dimensions at all

**Dataset state (checked against `production`)**: the dataset holds only
`author`, `blogPost`, `category`, `profile`, `project`, `tag` plus assets. **No
`siteSettings`, no `myProfilePage`, no `aboutPage`, no `projectPage` exist yet**,
so the navbar, footer and homepage hero render nothing until those documents are
created by hand in the Studio. `SITE_SETTINGS_QUERY` returning `null` is the
expected, handled state — not a bug.

### 5.7 Naming inconsistencies (don't propagate them)

`entites/` (typo) · kebab `blog-tag/` vs camel elsewhere · `pageSection` const
for `pageSections` `_type` · `structure.ts` file vs `structure/` dir ·
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
Studio `navLink` `reference` field starts offering that document type. Until the
entry exists, an internal link to that document type is impossible (and any
stale link resolves to `null` and is dropped rather than rendered dead).

**Adding a page-section block**

1. Create the object type under `src/sanity/buildableSection/<name>/index.ts`.
2. Add it to `hoistedObjects` in `schemaTypes/index.ts`.
3. Add it to the `of` array **and** the `insertMenu.groups` in
   `_root/sections/index.ts` (the existing `customImage` omission is a bug — copy
   the pattern correctly, not the omission).
4. Give it a `preview` — several section types have none and render
   identically in the desk.
5. If the frontend should render it, add a branch to
   `PortableTextComponent.tsx` or a new `pageSections` renderer.

**Before you finish**

```bash
pnpm test       # vitest, pure helpers only (routes/links/metadata/analytics)
pnpm lint
pnpm build      # typegen + next build; catches TS2305-class registry errors
```

`pnpm build` is the real gate. `pnpm lint` alone will not catch the schema/query
drift. `pnpm test` covers the pure helpers but does **not** touch Sanity — a
green suite is not evidence that CMS data renders.

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
`NEXT_PUBLIC_SANITY_DATASET`, `SMTP_USER`, `SMTP_PASSWORD`,
`MAIL_RECIEVER_ADDRESS`, `NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_DEVELOP`,
`NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_PRODUCTION`. There is **no** read token,
no draft mode, no preview — `defineLive` is configured with only `client`.

`NEXT_PUBLIC_SITE_URL` (e.g. `https://shahadat.dev`) is optional but recommended:
it is the origin used for canonical URLs and `metadataBase` in
`src/sanity/lib/metadata.ts`. Without it (or Vercel's
`VERCEL_PROJECT_PRODUCTION_URL`) canonical URLs are omitted rather than guessed.
The `..._STUDIO_PREVIEW_URL_*` vars are **not** used for this — they point at
`/studio`.
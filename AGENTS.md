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
pnpm typegen   # sanity schema extract + sanity typegen generate
```

`typegen` regenerates **two committed files**:

- `src/sanity/extract.json` — the extracted schema
- `src/sanity/types.ts` — generated schema + query-result types

Both are committed and **must be committed together** with any schema change.
They are currently dirty in the working tree; a schema/query change without
regenerating them is a bug.

---

## 3. Architecture

### 3.1 Two apps in one Next.js tree

```
src/app/layout.tsx                 root shell (html/body)
src/app/(frontend)/                public site — route group, no URL segment
  layout.tsx                       renders <SanityLive />, <ToastContainer/> lives in page
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
| `_root/` | Shared primitives: `media/` (customImage), `portableText/`, `category/`, `sections/` (`pageSections`), `seo/` (+`slug/`) |
| `entites/` | Referenced content records: `author`, `project` (note: folder is misspelled `entites`) |
| `pages/` | Singleton page documents: `profilePage` (`myProfilePage`), `aboutPage`, `projectPage` |
| `buildableSection/` | Composable page blocks: `profileContent`, `technologies`, `richText`, `carouselTech` |
| `miscellaneous/` | Loose leaf docs: `blog-tag/`, `tech-tag/` (kebab-case, unlike everything else) |
| `structure/` | Custom Studio sidebar (one module per top-level group) + `utils/create-document-structure.ts` |
| `components/` | Custom Studio input components (`slug-input`) |
| `schemaTypes/index.ts` | **The registry.** Everything must be registered here or it does not exist |
| `env.ts`, `utils/` | Studio-side helpers |

**Frontend side (data):** `lib/client.ts`, `lib/live.ts`, `lib/queries.ts`,
`lib/image.ts`. Note `lib/*.ts` uses single quotes / no semicolons while the
rest of the repo uses double quotes + semicolons.

### 3.3 Registration is the source of truth

`src/sanity/schemaTypes/index.ts` exports four arrays — `entities`,
`hoistedObjects`, `fixedPages`, `miscellaneous` — spread into `schema.types`.
A schema file that is not in one of those arrays **does not exist** to Sanity,
to `typegen`, or to GROQ. Comments at `index.ts:21-32` reference the deleted
pre-refactor layout; ignore them.

### 3.4 Data flow

`page.tsx` → `sanityFetch({ query, params })` (`defineLive`) → typed by
`defineQuery` against generated `SanityQueries` → passes **plain serializable
props** down to components. **Components never fetch.** `components/**` contains
zero imports of `sanityFetch`/`client`.

Client/server split is by interactivity only:

- `"use client"`: `contact/Form.tsx`, `navbar/Navbar.tsx`, `projects/Project.tsx`,
  `technology/Technology.tsx`, `youTube/YouTube.tsx` (carousels, hooks, forms)
- `"use server"`: `app/actions/sendEmail.ts`
- everything else: RSC

### 3.5 Studio sidebar

`src/sanity/structure.ts` composes: **Pages** (divider) **Entities** (divider)
**Miscellaneous**. Page singletons are pinned via
`structure/utils/create-document-structure.ts` (`S.document().documentId(typeName)`),
which is why the `[0]` in the page queries is safe.

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

### 5.2 GROQ queries are out of sync with the schema

Several queries target `_type` values that no longer exist. Symptom: generated
result types collapse to `null` / `Array<never>` in `src/sanity/types.ts`, and
because `never` allows arbitrary property access, **TypeScript stops complaining
while the page renders nothing.** Check `types.ts` for `null` / `Array<never>`
result types as your canary.

Known drift (verify before fixing — the schema may have moved again):

| Query | Queries | Actually registered |
|---|---|---|
| `PROFILE_QUERY` | `profilePage` | `myProfilePage` (different fields too) |
| `TECH_QUERY` | `tag` | `techTag` |
| `BLOG_POSTS_QUERY` / `SINGLE_BLOG_POST_QUERY` | `blogPost` | *nothing* — `schemaTypes/blogType.ts` is orphaned |
| `ABOUT_QUERY` | `aboutPage` | exists, but only `seo` + `pageSections` |

Also `blogTitle` vs `title` mismatch between the orphaned blog schema, the
queries, and `Blog.tsx`.

### 5.3 Dead / legacy code — do not build on it

- `src/sanity/schemaTypes/{about,blogType,profile}.ts` and
  `src/sanity/schemaTypes/preview/**` — orphaned. `about.ts` also collides on
  `_type` with `pages/aboutPage`. They are the *specification the stale GROQ was
  written against*, which is why 5.2 exists.
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
- `.map` on possibly-null query results (`Technology.tsx`, `blog/page.tsx`)
- no `notFound()` in `blog/[slug]/page.tsx`
- `parseISO` imported from `date-fns/fp` in `Project.tsx` — wrong submodule
- image transforms are inconsistent; three call sites pass `unoptimized`, two
  pass no dimensions at all

### 5.7 Naming inconsistencies (don't propagate them)

`entites/` (typo) · kebab `blog-tag/` vs camel elsewhere · `pageSection` const
for `pageSections` `_type` · `structure.ts` file vs `structure/` dir ·
`"nestjs"` in both layouts' `metadata` · `"Duretion:"` in `Project.tsx`.
Fix in place when you touch the file; don't add more.

---

## 6. How to make a change safely

**Adding a document type**

1. Create `src/sanity/<entites|pages|miscellaneous>/<name>/index.ts` with
   `defineType`.
2. Register it in `src/sanity/schemaTypes/index.ts` in the right array.
3. If it's a singleton page: add `seo()` and wire it into
   `structure/pages/index.ts` so it appears pinned in the sidebar.
4. Add a `defineQuery` const in `src/sanity/lib/queries.ts`.
5. Run `pnpm typegen`; check the new `*Result` type in `src/sanity/types.ts` is
   a real shape and **not** `null` / `Array<never>`.
6. Commit `extract.json` + `types.ts` with the change.

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
pnpm lint
pnpm build      # typegen + next build; catches TS2305-class registry errors
```

`pnpm build` is the real gate. `pnpm lint` alone will not catch the schema/query
drift.

---

## 7. Reference docs in-repo

- `docs/blog-rendering.md` — how the blog routes render (accurate but incomplete:
  it does not mention `revalidate: false` in production or the missing `blogPost` type)
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
# AGENTS.md

Working notes for AI agents and humans touching this repository. Read before writing code.

---

## 1. Overview & Tech Stack

Personal developer portfolio: **Next.js 16 (App Router) + React 19 + Sanity Studio** hosted in the same Next.js app.

| Piece | Detail |
|---|---|
| Framework | Next.js `16.1.6`, App Router, React `19.2.3`, TypeScript strict |
| Styling | Tailwind CSS **v4**, CSS-first config (`@theme` in `src/app/globals.css`). **No** `tailwind.config.*` |
| CMS | Sanity `^4.22`, `next-sanity` `^11.6`, Studio mounted at `/studio` |
| Data | `defineLive()` + `<SanityLive />` (live content API). No `generateStaticParams`, `revalidate`, or `unstable_cache` |
| Extras | `react-hook-form` + `react-toastify` + `nodemailer` server action, Embla carousels, `@portabletext/react` |
| Tooling | `pnpm`, path alias `@/*` → `./src/*` |

---

## 2. Commands & TypeGen Gate

```bash
pnpm dev       # runs `typegen` first via predev, then next dev
pnpm build     # runs `typegen` first via prebuild, then next build
pnpm lint      # eslint (flat config)
pnpm test      # vitest: helpers, components, schema registration & Studio structure
pnpm typegen   # sanity schema extract + sanity typegen generate
```

`predev` and `prebuild` run TypeGen automatically; run `pnpm typegen` manually after schema or GROQ edits outside those scripts. `typegen` regenerates **two committed files** that **must be committed together**:
- `src/sanity/extract.json` — extracted Sanity schema
- `src/sanity/types.ts` — generated schema + GROQ query-result types

---

## 3. Repository Architecture

```
src/app/layout.tsx                    root shell (html/body); imports globals.css
src/app/(frontend)/                   public site route group
  layout.tsx                          fetches LAYOUT_QUERY + SITE_SETTINGS_QUERY → <LayoutBuilder/>, generateMetadata
  page.tsx + query.ts                 home: <HeroBuilder/> + <SectionBuilder/> + standalone main sections
  blog/page.tsx + query.ts            blog index → <BlogCardBuilder/>
  blog/[slug]/                        single blog post → <BlogDetailsBuilder/> + interface.ts + query.ts
src/app/studio/[[...tool]]/page.tsx   Sanity Studio (export const dynamic = 'force-static')
src/app/actions/                      "use server" contact action (sendEmail.ts + contactValidation.ts)
src/fragments/                        shared root GROQ fragments (root/link, root/portable-text, root/seo)
src/layout/                           LayoutBuilder + query.ts + header/ + footer/ (with builder/ & fragment.ts)
src/hero/                             HeroBuilder + fragment.ts + primary/ (with builder/ & fragment.ts)
src/sections/                         independent section-builder/ + standalone main sections
src/components/                       atomic UI primitives (kebab-case folders with index.tsx & interface.ts)
src/emails/                           @react-email contact templates (index.tsx + interface.ts)
src/sanity/                           Studio config + schemas + SDK client/pure helpers (zero GROQ queries)
sanity.config.ts                      root Studio config
```

### 3.1 Frontend Architecture (Modular Builder Pattern)

Frontend modules use co-located `index.tsx` and `interface.ts` files (no global `src/app/types/`), and GROQ queries/fragments live exclusively in frontend layers (never inside `src/sanity/`):

1. **`src/fragments/`** — Shared root GROQ projections (`LINK_REFERENCE_FRAGMENT`, `PORTABLE_TEXT_PROJECTION`, `SEO_FIELDS_FRAGMENT`), re-exported via `src/fragments/index.ts`.
2. **`src/layout/`** — `LayoutBuilder` (`index.tsx`, `interface.ts`, `query.ts` with `LAYOUT_QUERY` & `SITE_SETTINGS_QUERY`), `header/`, and `footer/` (each with `builder/index.tsx`, `builder/interface.ts`, `builder/fragment.ts`).
3. **`src/hero/`** — `HeroBuilder` (`index.tsx`, `interface.ts`, `fragment.ts`) and `primary/` (`PrimaryHero` + `builder/`).
4. **`src/sections/`** — Two distinct concepts:
   - `section-builder/` (`index.tsx`, `interface.ts`, `fragment.ts` `PAGE_SECTIONS_FRAGMENT`) — Independent dynamic dispatcher for CMS `pageSections` blocks (`curiositySection`).
   - Standalone main sections (`curiosity/`, `about/`, `technology/`, `projects/`, `contact/`, `blogs/blog-card/`, `blogs/blog-details/`), each with `index.tsx` (pure UI), `interface.ts` (`I...Props`), `builder/` (`index.tsx`, `interface.ts` `ISanity...Props`, `fragment.ts`), and optional `sub-components/<part>/`.
5. **`src/components/`** — Atomic UI primitives (`analytics`, `background`, `button`, `image`, `nav-link`, `portable-text`, `preview-portable-text`, `section`, `social-links`, `youtube`).

### 3.2 Backend Architecture (`src/sanity/`)

| Folder | Contents |
|---|---|
| `_root/` | Shared schema primitives: `media/` (`customImage`), `portableText/`, `sections/` (`pageSections` reference array), `seo/` (+`slug/`), `link/`, `technology-item/`, `section-header/` |
| `global/` | Pinned singletons: `siteSettings/` (SEO / analytics), `layout/` (identity / header / footer) |
| `entites/` | Referenced content records: `author`, `blogPost`, `project` (note folder spelling `entites`) |
| `pages/` | Pinned singleton pages: `profilePage` (`myProfilePage`), `aboutPage`, `blogPage`, `projectPage` |
| `buildableSection/` | Reusable page section documents (`curiositySection`, `richTextSection`, `technologySection`, `technologyCarousel`, `aboutBuilderSection`, `aboutIntroSection`, `quoteSection`, `processSection`, `experienceSection`, `ctaSection`) + inline `heroSection` object |
| `miscellaneous/` | Leaf tag documents: `blogTag`, `techTag` |
| `structure/` | Custom Studio sidebar (`siteSettings`, `layout`, `pages`, `sections`, `entitiesStructure`, `miscellaneous`) + `utils/create-document-structure.ts` |
| `schemaTypes/index.ts` | **The schema registry.** Exports `globalSchemas`, `entities`, `sections`, `hoistedObjects`, `fixedPages`, `miscellaneous` |
| `lib/` | SDK & pure helpers: `client.ts`, `live.ts`, `image.ts`, `images.ts`, `formatDate.ts`, `hero.ts`, `curiosity.ts`, `routes.ts`, `links.ts`, `metadata.ts`, `analytics.ts`, `preview.ts` |

`src/sanity/` contains **zero** GROQ queries and **zero** imports from frontend layers (`src/app`, `src/components`, `src/sections`, `src/layout`, `src/hero`, `src/fragments`).

### 3.3 Data Flow & Studio Sidebar

- **Routes fetch, builders adapt, UI components render**: Route files (`layout.tsx`, `page.tsx`) call `sanityFetch({ query, params })` in parallel via `Promise.all()` and pass plain serializable props to `*Builder` components. Components and builders **never** import `sanityFetch` or `client`.
- **Client/Server boundary**: Only interactive leaves use `"use client"` (`layout/header/index.tsx`, `sections/contact/sub-components/form/index.tsx`, `sections/projects/index.tsx`, `sections/technology/index.tsx`, `components/youtube/index.tsx`). `app/actions/sendEmail.ts` uses `"use server"`. Everything else is RSC.
- **Studio sidebar (`src/sanity/structure.ts`)**: Composes **[pinned singletons: Site Settings, Layout]** → **Pages** → **Page Sections** (flat list of reusable section documents) → **Entities** → **Miscellaneous**.
- **Reference-based `pageSections`**: Sections (`curiositySection`, `richTextSection`, `technologySection`, `technologyCarousel`) are `type: "document"` created under **Page Sections**. Pages reference them via `pageSections` (`type: "reference"`), and `PAGE_SECTIONS_FRAGMENT` returns the ordered array `"sections": pageSections[]->{ _id, _type, _type == "..." => {...fragment} }`, and `SectionBuilder` renders each block by `_type` in Studio order (numbers computed from rendered sections). Adding a section = one fragment line + one `case`.

### 3.4 Global Singletons (`siteSettings` & `layout`)

- `layout.identity` — `siteTitle`, `siteDescription`, `logo` (`customImage`), `favicon`, `socialLinks[]` (shared by header/footer).
- `layout.header` — `links[]` (`link`), `cta` (`link`), `showSocialLinks`.
- `layout.footer` — `mainContent`, `email`, `phone`, `columns[]` (flat array of `link` objects), `base`.
- `siteSettings.seo` — `titleTemplate` (`{title}` placeholder), `defaultOgImage`, `robots`.
- `siteSettings.analytics` — `googleTagManagerID` (`^GTM-[A-Z0-9]+$`).
- **Nullability & Routing**: Singletons have fixed IDs (`_id == schema.name`) and may return `null` until created in Studio; every consumer must null-check. Internal links resolve exclusively via `ROUTES_BY_TYPE` in `src/sanity/lib/routes.ts`.

---

## 4. Conventions

- **Folders & Files**: `kebab-case` folders in frontend layers, each with `index.tsx` and `interface.ts` (`I...Props` for UI, `ISanity...Props` for builders).
- **Queries & Fragments**:
  - Root executable queries (`SCREAMING_SNAKE`) live in `src/layout/query.ts` and `src/app/(frontend)/**/query.ts` wrapped in `defineQuery(...)`.
  - Component fragments live in `builder/fragment.ts` (or `src/fragments/`) as `/* groq */ \`...\`` template literals (**never** wrap partial fragments in `defineQuery`, as TypeGen parses every `defineQuery` as a standalone root query).
- **Schema Idioms**:
  - Pass `seo()` from `_root/seo` to every page schema (`slug({ source, isFixed, prefix })` locks fixed route slugs).
  - Use `defineArrayMember()` for array `of` members and always provide a `preview` on section/object schemas.
  - Sections spread sectionHeaderFields(); do not copy those fields. Step numbers are computed by the frontend from order, never stored. Tools are inline reference arrays to techTag (max 4, unique).
- **Styling**: Tailwind v4 inline utilities using theme tokens from `@theme` in `src/app/globals.css` (`bg-primary/20`, `font-display`, `--breakpoint-3xl`). Never hardcode hex values. Fonts load via `src/app/fonts.ts`.

---

## 5. Traps & Gotchas

1. **GROQ vs. Schema Drift**: TypeGen resolves queries against `src/sanity/extract.json`. If a query targets an unregistered `_type` or filters before dereferencing a reference array (dereference first with `pageSections[]->{ ... }`; `(pageSections[]->[_type == "..."])[0]` returns `null` in real GROQ even though it typegens), its result type collapses to `null` or `Array<never>`. Always inspect `src/sanity/types.ts` after `pnpm typegen`.
2. **Portable Text Alignment**: `src/components/portable-text/index.tsx` and `src/components/preview-portable-text/index.tsx` must stay aligned with `PORTABLE_TEXT_PROJECTION` (`linkUrl` markDefs with `LINK_REFERENCE_FRAGMENT`, `customImage`/`portableImage`, `code`, `youtube`). Unresolved links render as plain text, never `href="#"`.
3. **Curiosity Block**: Has five fixed named tiles (`stack`, `learning`, `passion`, `interests`, `work`). Extend additively with new named tile fields; never turn tiles into a generic array. Every field in `curiositySection` must have a non-empty `description` (enforced by `registry.test.ts`).
4. **Dates & Links on Projects**: `project.projectLink` is a Sanity `link` object resolved in `ProjectsSectionBuilder` via `resolveLink()`. Guard date parsing (`formatDate` helper in `src/sanity/lib/formatDate.ts`).
5. **Known Legacy Quirks**:
   - `src/sanity/_root/seo/slug/restricted-slugs.ts` is unreachable legacy code.
   - `entites/` folder spelling and `MAIL_RECIEVER_ADDRESS` env var spelling are existing conventions—do not rename without a coordinated migration.

---

## 6. Safe Workflows

**Adding a Document Type**
1. Create `src/sanity/<global|entites|pages|miscellaneous>/<name>/index.ts` with `defineType`.
2. Register it in `src/sanity/schemaTypes/index.ts` (`globalSchemas`, `entities`, `fixedPages`, or `miscellaneous`).
3. If it is a singleton page, add `seo()` and wire it into `structure/pages/index.ts`.
4. Add its GROQ fragment (`builder/fragment.ts`) and `defineQuery` (`query.ts`), then run `pnpm typegen`.

**Adding a Page Section**
1. Create `src/sanity/buildableSection/<name>/index.ts` with `type: "document"` and a `preview`.
2. Add it to `sections` in `src/sanity/schemaTypes/index.ts` (auto-registers in Studio **Page Sections**).
3. Add a `type: "reference"` member to `of` and `insertMenu.groups` in `src/sanity/_root/sections/index.ts`.
4. Create `src/sections/<name>/` (`index.tsx`, `interface.ts`, `builder/index.tsx`, `builder/interface.ts`, `builder/fragment.ts`) and wire its `_type` into `src/sections/section-builder/`.
5. Run `pnpm typegen` and verify the generated types in `src/sanity/types.ts`.

**Adding a Route**
1. Add the document `_type` mapping to `ROUTES_BY_TYPE` in `src/sanity/lib/routes.ts`.
2. Create the route under `src/app/(frontend)/<route>/` (`page.tsx`, `query.ts`, `interface.ts`).

**Verification Gate (Before Finishing)**
```bash
pnpm test && pnpm lint && pnpm build
```

---

## 7. Reference Docs & Environment

- `docs/color-system.md` — Color tokens and surface system.
- `src/sections/contact/Email.FLow.md` — Contact form mail flow and SMTP env vars.
- **Required Env Vars (`.env.local`)**: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` (defaults to `2026-03-02`), `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_RECIEVER_ADDRESS`.
- **Optional Env Vars**: `NEXT_PUBLIC_SITE_URL` (canonical/metadata origin in `src/sanity/lib/metadata.ts`), `NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_DEVELOP`, `NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_PRODUCTION`.

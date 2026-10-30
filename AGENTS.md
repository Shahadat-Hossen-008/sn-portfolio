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
  page.tsx                            home route delegates to page-builder/my-profile
  blog/page.tsx                       blog index route delegates to page-builder/blog
  blog/[slug]/page.tsx                single post route delegates to page-builder/blog-details
  about/page.tsx                      About route delegates to page-builder/about
src/app/studio/[[...tool]]/page.tsx   Sanity Studio (export const dynamic = 'force-static')
src/app/actions/                      "use server" contact action (sendEmail.ts + contactValidation.ts)
src/fragments/                        shared root GROQ fragments (root/link, root/portable-text, root/seo)
src/layout/                           LayoutBuilder + query.ts + header/ + footer/ (with builder/ & fragment.ts)
src/page-builder/                     Page-specific query, fragment, data-loader, metadata, and composition modules
src/sections/                         independent section-builder/ + standalone main sections
src/sections/hero/                    HeroBuilder + fragment.ts + primary/ (with builder/ & fragment.ts)
src/lib/                              cross-layer helpers; Sanity-specific routing/link helpers in lib/sanity/
src/components/                       atomic UI primitives (kebab-case folders with index.tsx & interface.ts)
src/emails/                           @react-email contact templates (index.tsx + interface.ts)
src/sanity/                           Studio config + schemas + Sanity SDK adapters (zero GROQ queries)
sanity.config.ts                      root Studio config
```

### 3.1 Frontend Architecture (Modular Builder Pattern)

Frontend modules use co-located `index.tsx` and `interface.ts` files (no global `src/app/types/`), and GROQ queries/fragments live exclusively in frontend layers (never inside `src/sanity/`):

1. **`src/fragments/`** — Shared root GROQ projections (`LINK_REFERENCE_FRAGMENT`, `PORTABLE_TEXT_PROJECTION`, `SEO_FIELDS_FRAGMENT`), re-exported via `src/fragments/index.ts`.
2. **`src/layout/`** — `LayoutBuilder` (`index.tsx`, `interface.ts`, `query.ts` with `LAYOUT_QUERY` & `SITE_SETTINGS_QUERY`), `header/`, and `footer/` (each with `builder/index.tsx`, `builder/interface.ts`, `builder/fragment.ts`).
3. **`src/sections/hero/`** — `HeroBuilder` (`index.tsx`, `interface.ts`, `fragment.ts`) and `primary/` (`PrimaryHero` + `builder/`).
4. **`src/page-builder/`** — Page-specific data and composition modules. For example, `about/` owns the About page query, its projection fragment, request-cached loader, metadata, and composition; the matching route delegates to this module.
5. **`src/sections/`** — Two distinct concepts:
   - `section-builder/` (`index.tsx`, `interface.ts`, `fragment.ts` `PAGE_SECTIONS_FRAGMENT`) — Independent dynamic dispatcher for CMS `pageSections` blocks (`curiositySection`).
   - Standalone main sections (`curiosity/`, `about/`, `technology/`, `projects/`, `contact/`, `blogs/blog-card/`, `blogs/blog-details/`), each with `index.tsx` (pure UI), `interface.ts` (`I...Props`), `builder/` (`index.tsx`, `interface.ts` `ISanity...Props`, `fragment.ts`), and optional `sub-components/<part>/`.
6. **`src/components/`** — Atomic UI primitives (`analytics`, `background`, `button`, `image`, `nav-link`, `portable-text`, `preview-portable-text`, `section`, `social-links`, `youtube`).

### 3.2 Backend Architecture (`src/sanity/`)

| Folder | Contents |
|---|---|
| `_root/` | Shared schema primitives: `media/` (`customImage`), `portableText/`, `sections/` (`pageSections` reference array), `seo/` (+`slug/`), `link/`, `technology-item/`, `section-header/`, and inline `page-intro-section/` |
| `global/` | Pinned singletons: `siteSettings/` (SEO / analytics), `layout/` (identity / header / footer) |
| `entites/` | Referenced content records: `author`, `blogPost`, `project` (note folder spelling `entites`) |
| `pages/` | Pinned singleton pages: `profilePage` (`myProfilePage`), `aboutPage`, `blogPage`, `projectPage` |
| `buildableSection/` | Reusable page section documents such as `curiositySection`, `aboutBuilderSection`, `quoteSection`, `processSection`, `experienceSection`, and `ctaSection` |
| `miscellaneous/` | Leaf tag documents: `blogTag`, `techTag` |
| `structure/` | Custom Studio sidebar (`siteSettings`, `layout`, `pages`, `sections`, `entitiesStructure`, `miscellaneous`) + `utils/create-document-structure.ts` |
| `schemaTypes/index.ts` | **The schema registry.** Exports `globalSchemas`, `entities`, `sections`, `hoistedObjects`, `fixedPages`, `miscellaneous` |
| `components/` | Studio-only custom inputs: `slug-input/` (slug field UI) and `portable-text-input/` (global Portable Text focus workaround, see §5.6) |
| `lib/` | Sanity-specific adapters: `client.ts`, `live.ts`, `image.ts`, `images.ts`, `preview.ts` |

`src/lib/` contains framework-independent helpers shared by schemas and the frontend (`formatDate.ts`, `hero.ts`), frontend metadata helpers, and Sanity link/routing helpers under `src/lib/sanity/`. Page and section-specific helpers stay in their owning `src/page-builder/` or `src/sections/` module; component-only helpers stay beside their component.

`src/sanity/` contains **zero** GROQ queries and **zero** imports from frontend layers (`src/app`, `src/components`, `src/sections`, `src/layout`, `src/page-builder`, `src/fragments`). Cross-layer pure helpers belong in `src/lib/`; feature-specific helpers and query-derived types belong with their frontend feature or page-builder.

### 3.3 Data Flow & Studio Sidebar

- **Routes delegate, page builders fetch and compose, UI components render**: Public routes delegate data loading, metadata, and composition to their matching `src/page-builder/<page>/` module. Page-builder modules own page-specific root queries, projection fragments, cached loaders, and page composition; shared UI and section builders **never** import `sanityFetch` or `client`.
- **Client/Server boundary**: Only interactive leaves use `"use client"` (`layout/header/index.tsx`, `sections/contact/sub-components/form/index.tsx`, `sections/projects/index.tsx`, `sections/technology/index.tsx`, `components/youtube/index.tsx`). `app/actions/sendEmail.ts` uses `"use server"`. Everything else is RSC.
- **Studio sidebar (`src/sanity/structure.ts`)**: Composes **[pinned singletons: Site Settings, Layout]** → **Pages** → **Page Sections** (flat list of reusable section documents) → **Entities** → **Miscellaneous**.
- **Reference-based `pageSections`**: Sections (`curiositySection`, `richTextSection`, `technologySection`, `technologyCarousel`) are `type: "document"` created under **Page Sections**. Pages reference them via `pageSections` (`type: "reference"`), and `PAGE_SECTIONS_FRAGMENT` returns the ordered array `"sections": pageSections[]->{ _id, _type, _type == "..." => {...fragment} }`, and `SectionBuilder` renders each block by `_type` in Studio order (numbers computed from rendered sections). Adding a section = one fragment line + one `case`.
- **Page-specific openings**: Content that belongs only at the top of a page should be modeled as an inline object on that page singleton, before its reorderable `pageSections`. Use `pageSections` references for reusable or editor-reorderable content.

### 3.4 Global Singletons (`siteSettings` & `layout`)

- `layout.identity` — `siteTitle`, `siteDescription`, `logo` (`customImage`), `favicon`, `socialLinks[]` (shared by header/footer).
- `layout.header` — `links[]` (`link`), `cta` (`link`), `showSocialLinks`.
- `layout.footer` — `mainContent`, `email`, `phone`, `columns[]` (flat array of `link` objects), `base`.
- `siteSettings.seo` — `titleTemplate` (`{title}` placeholder), `defaultOgImage`, `robots`.
- `siteSettings.analytics` — `googleTagManagerID` (`^GTM-[A-Z0-9]+$`).
- **Nullability & Routing**: Singletons have fixed IDs (`_id == schema.name`) and may return `null` until created in Studio; every consumer must null-check. Internal links resolve exclusively via `ROUTES_BY_TYPE` in `src/lib/sanity/routes.ts`.

---

## 4. Conventions

- **Folders & Files**: `kebab-case` folders in frontend layers, each with `index.tsx` and `interface.ts` (`I...Props` for UI, `ISanity...Props` for builders).
- **Queries & Fragments**:
  - Root executable queries (`SCREAMING_SNAKE`) live in `src/layout/query.ts` or beside their page-builder module in `query.ts` and are wrapped in `defineQuery(...)`.
  - Shared root fragments live in `src/fragments/`; page-owned projections live in the matching page-builder's `fragment.ts`; feature fragments live beside their builders in `builder/fragment.ts`. Use `/* groq */ \`...\`` template literals for partial fragments (**never** wrap partial fragments in `defineQuery`, as TypeGen parses every `defineQuery` as a standalone root query).
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
6. **Portable Text Focus Workaround (Studio only)**: `src/sanity/components/portable-text-input/index.tsx` is a **version-pinned patch for a Sanity bug**, registered globally via `form.components.input` in `sanity.config.ts`. It is not content-model scaffolding: Portable Text object blocks (`portableTextImage`, `code`, `youtube`, `editorialSection`, …) open dialogs, and on `sanity@4.22.1` the document form's focus handler collapses `openPath`, so the dialog closes the moment focus lands on the block. A single image block reproduces it — removing block types does **not** remove the need for the patch.
   - **Removal condition**: delete the wrapper and its `sanity.config.ts` wiring only after upgrading to **`sanity >= 6.14.1`**. Upstream fix landed in `6.9.2` (PR sanity-io/sanity#13924), but `6.9.2`–`6.14.0` shipped a Portable Text data-loss regression; `6.14.1` is the first safe target.
   - **Before deleting**, manually verify in Studio: (a) upload an image inside Portable Text and confirm the block dialog stays open, (b) open `editorialSection` and type in its fields without focus jumping, (c) nested dialogs (table rows/cells, card items) keep focus. The wrapper has two guards — the single-segment `onPathFocus` guard maps to #13924; the `selection`-payload guard is defensive and is **not** guaranteed fixed by that PR.
   - The wrapper reads non-public props (`member.open`, `member.item.members`, `field.members`, `onPathFocus` payloads); re-verify after any Sanity major upgrade.

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

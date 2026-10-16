/**
 * Single source of truth for "which CMS document becomes which frontend URL".
 *
 * This module is intentionally dependency-free so it can be imported from both
 * the Studio schema layer (`src/sanity/_root/link`) and the Next.js
 * frontend (`src/sanity/lib/links.ts`) without pulling React or Next in.
 *
 * Why an explicit map instead of `reference->seo.slug.current`?
 *
 * Not every routable document has a usable slug in Sanity:
 *   - `myProfilePage` has a fixed, empty slug and renders at `/`.
 *   - `blogPost` keeps a top level `slug`, not `seo.slug`.
 *   - `aboutPage` / `projectPage` are fixed-slug singletons whose routes are
 *     **not implemented yet** in `src/app/(frontend)`, so resolving them would
 *     produce a 404. They are intentionally absent from the map; adding the
 *     route means adding the entry here *and* `INTERNAL_REFERENCE_TYPES` below
 *     becomes valid again automatically (the Studio `reference` field derives
 *     its allowed types from that array).
 *
 * Type safety: `INTERNAL_REFERENCE_TYPES` is derived from the map keys, so a
 * resolver can never be written for a document type the Studio cannot produce,
 * and a Studio `reference` can never point at a document with no resolver.
 */

export const ROUTES_BY_TYPE = {
  myProfilePage: () => "/",
  blogPost: (slug?: string | null) =>
    slug ? `/blog/${encodeURIComponent(slug)}` : null,
} as const;

export type RoutedType = keyof typeof ROUTES_BY_TYPE;

export type RouteResolver = (slug?: string | null) => string | null;

/** Document `_type`s that the Studio `reference` field is allowed to point at. */
export const INTERNAL_REFERENCE_TYPES = Object.keys(
  ROUTES_BY_TYPE,
) as RoutedType[];

/**
 * Homepage sections that may be targeted by an anchor link. Only these
 * fragments are approved; anything else resolves to `null` so editors cannot
 * create dead fragment links.
 */
export const HOMEPAGE_SECTIONS = ["about", "projects", "contact"] as const;

export type HomepageSection = (typeof HOMEPAGE_SECTIONS)[number];

/**
 * Resolves a CMS document reference to a frontend path.
 *
 * Returns `null` (never a guessed URL) when the document type is unknown, has
 * no resolver, or when the resolver decides the document is not addressable —
 * for example a `blogPost` that has no slug yet.
 */
export function resolveRoute(
  type: string | null | undefined,
  slug?: string | null,
): string | null {
  if (!type) return null;

  const resolver = (ROUTES_BY_TYPE as Record<string, RouteResolver | undefined>)[
    type
  ];

  if (!resolver) return null;

  return resolver(slug);
}

/**
 * Homepage-anchor model.
 *
 * Editors write `#about` because that is what they see in the preview on the
 * homepage, but a bare fragment is a no-op on `/blog`. Anchors are therefore
 * normalised against the site root so they work from every route, and only
 * approved homepage sections are accepted:
 *
 *   `#about`     -> `/#about`
 *   `about`      -> `/#about`  (forgiving: no `#` typed)
 *   `/#about`    -> `/#about`
 *   `#`          -> `/`        (bare root anchor)
 *   `/blog`      -> `/blog`    (absolute route, no fragment)
 *   `#nope`      -> `null`     (not an approved section)
 */
export function anchorHref(anchor: string | null | undefined): string | null {
  const trimmed = anchor?.trim();

  if (!trimmed) return null;
  if (trimmed === "#") return "/";

  // Keep safe, same-origin root-relative routes intact.
  if (trimmed.startsWith("/") && !trimmed.includes("#")) {
    if (!/^\/(?!\/)[^\s\\'"<>]*$/.test(trimmed)) return null;
    return trimmed;
  }

  const fragment = trimmed.replace(/^\/?#/, "");

  if (!HOMEPAGE_SECTIONS.includes(fragment as HomepageSection)) return null;

  return `/#${fragment}`;
}

/** Absolute URL for metadata / Open Graph, used only on the server. */
export function absoluteUrl(path: string, base?: string | null): string | null {
  const origin = base?.trim() || siteOrigin();

  if (!origin) return null;

  try {
    return new URL(path, origin).toString();
  } catch {
    return null;
  }
}

/**
 * Best-effort site origin for `metadataBase` and absolute canonical URLs.
 *
 * Deliberately never throws: a missing env var must not take down every route.
 *
 * `NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_*` is intentionally **not** used here —
 * those point at the `/studio` route, not at the public site, so reusing them
 * would emit `http://localhost:3000/studio` as the canonical origin.
 *
 * Add `NEXT_PUBLIC_SITE_URL=https://your-domain.com` to `.env.local` (or rely
 * on Vercel's `VERCEL_PROJECT_PRODUCTION_URL`). Without it, canonical URLs and
 * OG image absolute URLs are simply omitted rather than guessed.
 */
function siteOrigin(): string | null {
  const explicit = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL
  )?.trim();

  if (!explicit) return null;

  try {
    return new URL(
      explicit.startsWith("http") ? explicit : `https://${explicit}`,
    ).origin;
  } catch {
    return null;
  }
}

/** The resolved site origin, or `null` when it cannot be determined. */
export function getSiteOrigin(): string | null {
  return siteOrigin();
}
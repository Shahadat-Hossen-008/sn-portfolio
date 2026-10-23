/**
 * Internal `link` reference, projected as `{ _type, slug }`.
 *
 * `slug` coalesces `seo.slug.current` (singletons) with the top level
 * `slug.current` (`blogPost`) so the frontend never has to guess. The frontend
 * then maps `_type` to a route through `ROUTES_BY_TYPE` in
 * `@/sanity/lib/routes` — it does not trust the slug on its own.
 */
export const LINK_REFERENCE_FRAGMENT = /* groq */ `
  "reference": reference->{ _type, "slug": coalesce(seo.slug.current, slug.current) }
`;

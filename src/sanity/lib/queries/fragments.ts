/** Internal reference projection shared by Sanity link query projections. */
export const LINK_REFERENCE_FRAGMENT = /* groq */ `
  "reference": reference->{ _type, "slug": coalesce(seo.slug.current, slug.current) }
`;

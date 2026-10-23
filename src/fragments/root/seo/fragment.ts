/**
 * Shared projection of the per-document `seo` object.
 *
 * `seo` is optional on content-first documents (`blogPost`), so callers must
 * treat a `null` seo as "inherit everything from `siteSettings`".
 */
export const SEO_FIELDS_FRAGMENT = /* groq */ `
  seo {
    title,
    description,
    openGraph {
      title,
      description,
      image {
        imageFile {
          asset->{_id, url, metadata{dimensions{width, height}}}
        },
        altText
      }
    },
    robots {
      disableIndex,
      disableFollow,
      disableImageIndex,
      disableSnippet
    },
    canonicalUrl,
    redirect,
    keywords
  }
`;

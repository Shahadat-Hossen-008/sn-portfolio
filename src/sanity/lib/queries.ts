import { defineQuery } from "next-sanity";

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
    keywords,
    jsonld
  }
`;

/**
 * An internal `link` reference, projected as `{ _type, slug }`.
 *
 * `slug` coalesces `seo.slug.current` (singletons) with the top level
 * `slug.current` (`blogPost`) so the frontend never has to guess. The frontend
 * then maps `_type` to a route through `ROUTES_BY_TYPE` in
 * `@/sanity/lib/routes` — it does not trust the slug on its own.
 */
export const LINK_REFERENCE_FRAGMENT = /* groq */ `
  "reference": reference->{ _type, "slug": coalesce(seo.slug.current, slug.current) }
`;

/**
 * Singleton profile page (`myProfilePage`).
 *
 * `fullName` / `headline` are read through the `autherInfo` reference to the
 * `author` document: `author.fullName` is the person, `author.description` is
 * described in the schema as the "author role" line, which is what the hero
 * renders as its headline.
 *
 * The bio and the portrait are NOT projected: `myProfilePage` has no flat
 * field for them, they live inside `pageSections[_type == "profileContent"]`
 * blocks which have no frontend renderer yet.
 */
export const PROFILE_QUERY = defineQuery(`*[_type == "myProfilePage"][0]{
  "fullName": autherInfo->fullName,
  "headline": autherInfo->description,
  "cvUrl": uploadCV.asset->url
}`);

/**
 * Singleton about page (`aboutPage`).
 *
 * `aboutPage` only carries `seo` + `pageSections`, so the flat
 * `description` / `technologies` the About component renders are projected out
 * of the page builder:
 *   - description  <- first `richTextSection` block's Portable Text
 *   - technologies <- every `technologyItem` object across the technology blocks
 *
 * `technologyItem` is an inline object (not a reference), so there is no `_id` to
 * key on; the title is aliased to `label` to keep the component contract.
 *
 * NOTE: the legacy `socialLinks` array has no home in the current schema. It
 * is intentionally not projected here.
 */
export const ABOUT_QUERY = defineQuery(`*[_type == "aboutPage"][0]{
  "description": pageSections[_type == "richTextSection"][0].content,
  "technologies": pageSections[_type == "technologySection" || _type == "technologyCarousel"].technology[]{"label": title}
}`);

/**
 * Technology icons carousel (`techTag`).
 */
export const TECH_QUERY = defineQuery(`*[_type == "techTag"][]{
  _id,
  label,
  iconImage
}`);

/**
 * Projects (`project`).
 *
 * `projectLink` is a `link` object; the frontend resolves its href through the
 * shared resolver in `@/sanity/lib/links`, which omits legacy bare-string values
 * and malformed URLs rather than rendering a broken href.
 */
export const PROJECT_QUERY = defineQuery(`*[_type == "project"][]{
  _id,
  projectDescription,
  start,
  end,
  githubUrl,
  projectImage,
  projectLink,
  projectTitle
}`);

/**
 * Blog index (`blogPost`).
 */
export const BLOG_POSTS_QUERY = defineQuery(`*[_type == "blogPost"]{
  _id,
  _createdAt,
  blogTitle,
  slug,
  mainImage,
  categories[]->{_id, title},
  author,
  publishedAt,
  blogContent
}`);

/**
 * Single blog post (`blogPost`), resolved by slug. Returns `null` when no post
 * matches, so callers must handle the miss (see `notFound()` in the route).
 */
export const SINGLE_BLOG_POST_QUERY = defineQuery(`*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  _createdAt,
  blogTitle,
  slug,
  mainImage,
  categories[]->{_id, title},
  author,
  publishedAt,
  blogContent,
  ${SEO_FIELDS_FRAGMENT}
}`);

/**
 * Singleton layout (`layout`).
 *
 * Returns `null` until the document has been created in the Studio, which is a
 * supported state: the navbar and footer render nothing in that state. Every
 * consumer must null-check.
 */
export const LAYOUT_QUERY = defineQuery(`*[_type == "layout"][0]{
  identity {
    siteTitle,
    siteDescription,
    logo {
      imageFile {
        asset->{_id, url, metadata{dimensions{width, height}}}
      },
      altText
    },
    favicon {
      asset->{_id, url, metadata{dimensions{width, height}}}
    },
    socialLinks[]{
      network,
      label,
      url
    }
  },
  header {
    links[]{
      _key,
      label,
      type,
      url,
      openInNewTab,
      isDisabled,
      ${LINK_REFERENCE_FRAGMENT}
    },
    cta {
      label,
      type,
      url,
      openInNewTab,
      isDisabled,
      ${LINK_REFERENCE_FRAGMENT}
    },
    showSocialLinks
  },
  footer {
    mainContent,
    email,
    phone,
    base,
    columns[]{
      _key,
      title,
      links[]{
        _key,
        label,
        type,
        url,
        openInNewTab,
        isDisabled,
        ${LINK_REFERENCE_FRAGMENT}
      }
    }
  }
}`);

/**
 * Site-wide settings singleton (`siteSettings`).
 *
 * Returns `null` until the document has been created in the Studio, which is a
 * supported state: SEO falls back to built-in defaults and analytics is not
 * loaded. Every consumer must null-check.
 */
export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  seo {
    titleTemplate,
    defaultOgImage {
      imageFile {
        asset->{_id, url, metadata{dimensions{width, height}}}
      },
      altText
    },
    robots {
      disableIndex,
      disableFollow,
      disableImageIndex,
      disableSnippet
    }
  },
  analytics {
    googleTagManagerID
  }
}`);
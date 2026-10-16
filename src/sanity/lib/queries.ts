import { defineQuery } from "next-sanity";

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
 * `projectLink` is a `link` object (from sanity-plugin-link-field), not a
 * string, so a flat href is projected alongside it. `projectLinkUrl` is what
 * the component anchors to; see `scripts/migrate-legacy-content.mjs`, which
 * normalises the legacy string-shaped `projectLink` values into real link
 * objects.
 */
export const PROJECT_QUERY = defineQuery(`*[_type == "project"][]{
  _id,
  projectDescription,
  start,
  end,
  githubUrl,
  projectImage,
  projectLink,
  "projectLinkUrl": coalesce(projectLink.url, ""),
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
  blogContent
}`);
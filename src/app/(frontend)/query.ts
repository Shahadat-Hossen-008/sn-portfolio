import { defineQuery } from "next-sanity";
import { HERO_FRAGMENT } from "@/hero/fragment";
import { ABOUT_SECTION_FRAGMENT } from "@/sections/about/builder/fragment";
import {
  LATEST_PROJECTS_FRAGMENT,
  PROJECT_SECTION_FRAGMENT,
} from "@/sections/projects/builder/fragment";
import { PAGE_SECTIONS_FRAGMENT } from "@/sections/section-builder/fragment";
import { TECH_SECTION_FRAGMENT } from "@/sections/technology/builder/fragment";

/**
 * Singleton profile page (`myProfilePage`).
 *
 * `fullName` / `headline` are read through the `autherInfo` reference to the
 * `author` document: `author.fullName` is the person, `author.description` is
 * described in the schema as the "author role" line, which is what the hero
 * renders as its headline.
 *
 * Hero content is optional to support the already-published singleton. The
 * author reference supplies the existing full-name fallback; the author schema
 * has no image field.
 */
export const PROFILE_QUERY = defineQuery(`*[_type == "myProfilePage"][0]{
  ${HERO_FRAGMENT},
  ${PAGE_SECTIONS_FRAGMENT}
}`);

/** Three newest projects, used when the curiosity tile has no explicit picks. */
export const LATEST_PROJECTS_QUERY = defineQuery(`*[_type == "project"] | order(date desc, _createdAt desc)[0...3]{
  ${LATEST_PROJECTS_FRAGMENT}
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
  ${ABOUT_SECTION_FRAGMENT}
}`);

/**
 * Technology icons carousel (`techTag`).
 */
export const TECH_QUERY = defineQuery(`*[_type == "techTag"][]{
  ${TECH_SECTION_FRAGMENT}
}`);

/**
 * Projects (`project`).
 *
 * `projectLink` is a `link` object; the frontend resolves its href through the
 * shared resolver in `@/sanity/lib/links`, which omits legacy bare-string values
 * and malformed URLs rather than rendering a broken href.
 */
export const PROJECT_QUERY = defineQuery(`*[_type == "project"][]{
  ${PROJECT_SECTION_FRAGMENT}
}`);

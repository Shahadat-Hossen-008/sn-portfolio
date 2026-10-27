import { defineQuery } from "next-sanity";

import { SEO_FIELDS_FRAGMENT } from "@/fragments";
import { PAGE_INTRO_FRAGMENT } from "@/sections/page-intro/builder/fragment";
import { PAGE_SECTIONS_FRAGMENT } from "@/sections/section-builder/fragment";

/**
 * Singleton about page (`aboutPage`).
 * Projects the SEO fields, the inline `pageIntro` opening block, and the full
 * ordered, dereferenced pageSections array.
 */
export const ABOUT_PAGE_QUERY = defineQuery(`*[_type == "aboutPage"][0]{
  ${SEO_FIELDS_FRAGMENT},
  ${PAGE_INTRO_FRAGMENT},
  ${PAGE_SECTIONS_FRAGMENT}
}`);
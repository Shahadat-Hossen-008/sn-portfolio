import { defineQuery } from "next-sanity";

import { SEO_FIELDS_FRAGMENT } from "@/fragments";
import { PAGE_SECTIONS_FRAGMENT } from "@/sections/section-builder/fragment";

/**
 * Singleton about page (`aboutPage`).
 * Projects the SEO fields and the full ordered, dereferenced pageSections array.
 */
export const ABOUT_PAGE_QUERY = defineQuery(`*[_type == "aboutPage"][0]{
  ${SEO_FIELDS_FRAGMENT},
  ${PAGE_SECTIONS_FRAGMENT}
}`);

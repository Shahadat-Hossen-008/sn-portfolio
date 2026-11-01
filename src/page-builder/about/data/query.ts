import { defineQuery } from "next-sanity";

import { PAGE_INTRO_FRAGMENT } from "@/sections/page-intro/builder/fragment";
import { SEO_FIELDS_FRAGMENT } from "@/fragments";
import { PAGE_SECTIONS_FRAGMENT } from "@/sections/section-builder/fragment";

/** Singleton About page query, including the page-owned opening and sections. */
export const ABOUT_PAGE_QUERY = defineQuery(
  `*[_type == "aboutPage"][0]{
      ${SEO_FIELDS_FRAGMENT},
      ${PAGE_INTRO_FRAGMENT},
      ${PAGE_SECTIONS_FRAGMENT}
  }`,
);

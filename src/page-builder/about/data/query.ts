import { defineQuery } from "next-sanity";

import { ABOUT_INTRO_FRAGMENT } from "@/sections/about-intro/builder/fragment";
import { SEO_FIELDS_FRAGMENT } from "@/fragments";
import { PAGE_SECTIONS_FRAGMENT } from "@/sections/section-builder/fragment";

/** Singleton About page query, including the page-owned opening and sections. */
export const ABOUT_PAGE_QUERY = defineQuery(
  `*[_type == "aboutPage" && _id == "aboutPage"][0]{
      ${SEO_FIELDS_FRAGMENT},
      ${ABOUT_INTRO_FRAGMENT},
      ${PAGE_SECTIONS_FRAGMENT}
  }`,
);

import { defineQuery } from "next-sanity";

import { SEO_FIELDS_FRAGMENT } from "@/fragments";
import { HERO_FRAGMENT } from "@/sections/hero/fragment";
import { PAGE_SECTIONS_FRAGMENT } from "@/sections/section-builder/fragment";

/** Home-page profile singleton, including the hero and ordered page sections. */
export const PROFILE_QUERY = defineQuery(`*[_type == "myProfilePage"][0]{
  ${SEO_FIELDS_FRAGMENT},
  ${HERO_FRAGMENT},
  ${PAGE_SECTIONS_FRAGMENT}
}`);

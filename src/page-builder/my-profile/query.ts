import { defineQuery } from "next-sanity";

import { SEO_FIELDS_FRAGMENT } from "@/fragments";
import { HERO_FRAGMENT } from "@/sections/hero/fragment";
import { ABOUT_SECTION_FRAGMENT } from "@/sections/about/builder/fragment";
import {
  LATEST_PROJECTS_FRAGMENT,
  PROJECT_SECTION_FRAGMENT,
} from "@/sections/projects/builder/fragment";
import { PAGE_SECTIONS_FRAGMENT } from "@/sections/section-builder/fragment";
import { TECH_SECTION_FRAGMENT } from "@/sections/technology/builder/fragment";

/** Home-page profile singleton, including the hero and ordered page sections. */
export const PROFILE_QUERY = defineQuery(`*[_type == "myProfilePage"][0]{
  ${SEO_FIELDS_FRAGMENT},
  ${HERO_FRAGMENT},
  ${PAGE_SECTIONS_FRAGMENT}
}`);

/** Three newest projects used when the curiosity section has no selected projects. */
export const LATEST_PROJECTS_QUERY = defineQuery(`*[_type == "project"] | order(date desc, _createdAt desc)[0...3]{
  ${LATEST_PROJECTS_FRAGMENT}
}`);

/** About-section data projected from reusable content on the About page. */
export const ABOUT_QUERY = defineQuery(`*[_type == "aboutPage"][0]{
  ${ABOUT_SECTION_FRAGMENT}
}`);

/** Technology carousel records. */
export const TECH_QUERY = defineQuery(`*[_type == "techTag"][]{
  ${TECH_SECTION_FRAGMENT}
}`);

/** Project cards for the home page. */
export const PROJECT_QUERY = defineQuery(`*[_type == "project"][]{
  ${PROJECT_SECTION_FRAGMENT}
}`);

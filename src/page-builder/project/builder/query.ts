import { defineQuery } from "next-sanity";
import { PAGE_INTRO_FRAGMENT } from "@/sections/page-intro/builder/fragment";
import { SEO_FIELDS_FRAGMENT } from "@/fragments";
import { PROJECT_SECTION_FRAGMENT } from "@/sections/projects/builder/fragment";
import { PAGE_SECTIONS_FRAGMENT } from "@/sections/section-builder/fragment";

/** Singleton Project page query, including the page-owned opening and sections. */
export const PROJECT_PAGE_QUERY = defineQuery(
  `*[_type == "projectPage"][0]{
    ${SEO_FIELDS_FRAGMENT},
    ${PAGE_INTRO_FRAGMENT},
    "projects": select(
      defined(projects) && count(projects) > 0 =>
        projects[]->{ ${PROJECT_SECTION_FRAGMENT} },
      *[_type == "project"] | order(date desc, _createdAt desc)[]{
        ${PROJECT_SECTION_FRAGMENT}
      }
    ),
    ${PAGE_SECTIONS_FRAGMENT}
    }`,
);

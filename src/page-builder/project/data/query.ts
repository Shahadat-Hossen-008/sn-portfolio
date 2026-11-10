import { defineQuery } from "next-sanity";
import { SECTION_HEADING_FRAGMENT, SEO_FIELDS_FRAGMENT } from "@/fragments";
import { PAGE_SECTIONS_FRAGMENT } from "@/sections/section-builder/fragment";
import { PROJECT_SECTION_FRAGMENT } from "./fragment";

/** Singleton Project page query, including the page-owned opening and sections. */
export const PROJECT_PAGE_QUERY = defineQuery(
  `*[_type == "projectPage"][0]{
    ${SEO_FIELDS_FRAGMENT},
    ${SECTION_HEADING_FRAGMENT},
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

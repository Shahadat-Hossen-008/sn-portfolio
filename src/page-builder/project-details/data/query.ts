import { defineQuery } from "next-sanity";
import { CUSTOM_IMAGE_FRAGMENT, PORTABLE_TEXT_PROJECTION, SEO_FIELDS_FRAGMENT } from "@/fragments";

/** Single project case study query by slug. */
export const SINGLE_PROJECT_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    _createdAt,
    projectTitle,
    "slug": slug.current,
    projectType,
    status,
    role,
    duration,
    client,
    projectDescription,
    start,
    end,
    liveLink,
    githubUrl,
    projectImage {
      ${CUSTOM_IMAGE_FRAGMENT}
    },
    "stack": stack[]->{ _id, label },
    "caseStudy": caseStudy${PORTABLE_TEXT_PROJECTION},
    ${SEO_FIELDS_FRAGMENT}
  }
`);

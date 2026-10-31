import { defineQuery } from "next-sanity";

import { SEO_FIELDS_FRAGMENT } from "@/fragments";
import { BLOG_DETAILS_FRAGMENT } from "@/sections/blogs/blog-details/builder/fragment";

/** Single blog post by slug. */
export const SINGLE_BLOG_POST_QUERY = defineQuery(`*[_type == "blogPost" && slug.current == $slug][0]{
  ${BLOG_DETAILS_FRAGMENT},
  ${SEO_FIELDS_FRAGMENT}
}`);

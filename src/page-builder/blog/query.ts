import { defineQuery } from "next-sanity";

import { BLOG_CARD_FRAGMENT } from "@/sections/blogs/blog-card/builder/fragment";

/** Blog index content. */
export const BLOG_POSTS_QUERY = defineQuery(`*[_type == "blogPost"]{
  ${BLOG_CARD_FRAGMENT}
}`);

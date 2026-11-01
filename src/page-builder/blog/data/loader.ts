import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import { BLOG_POSTS_QUERY } from "./query";

export const getBlogPosts = cache(async () => {
  try {
    return await sanityFetch({ query: BLOG_POSTS_QUERY });
  } catch (error) {
    console.warn("[getBlogPosts] Network error fetching blog posts:", error);
    return { data: null };
  }
});

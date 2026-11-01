import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import { SINGLE_BLOG_POST_QUERY } from "./query";

export const getBlogPost = cache(async (slug: string) => {
  try {
    return await sanityFetch({
      query: SINGLE_BLOG_POST_QUERY,
      params: { slug },
    });
  } catch (error) {
    console.warn(`[getBlogPost] Network error fetching blog post "${slug}":`, error);
    return { data: null };
  }
});

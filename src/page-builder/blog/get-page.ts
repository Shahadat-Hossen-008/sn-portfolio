import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import { BLOG_POSTS_QUERY } from "./query";

export const getBlogPosts = cache(async () =>
  sanityFetch({ query: BLOG_POSTS_QUERY }),
);

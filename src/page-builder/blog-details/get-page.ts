import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import { SINGLE_BLOG_POST_QUERY } from "./query";

export const getBlogPost = cache(async (slug: string) =>
  sanityFetch({
    query: SINGLE_BLOG_POST_QUERY,
    params: { slug },
  }),
);

import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import { PROJECT_PAGE_QUERY } from "./query";

/** Deduplicates the Project page query across route rendering and metadata. */
export const getProjectPage = cache(async () => {
  try {
    return await sanityFetch({ query: PROJECT_PAGE_QUERY });
  } catch (error) {
    console.warn("[getProjectPage] Network error fetching project page:", error);
    return { data: null };
  }
});

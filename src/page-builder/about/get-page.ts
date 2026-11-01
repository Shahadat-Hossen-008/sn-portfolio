import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import { ABOUT_PAGE_QUERY } from "./query";

/** Deduplicates the About page query across route rendering and metadata. */
export const getAboutPage = cache(async () => {
  try {
    return await sanityFetch({ query: ABOUT_PAGE_QUERY });
  } catch (error) {
    console.warn("[getAboutPage] Network error fetching about page:", error);
    return { data: null };
  }
});

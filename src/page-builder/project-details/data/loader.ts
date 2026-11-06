import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import { SINGLE_PROJECT_QUERY } from "./query";

export const getProject = cache(async (slug: string) => {
  try {
    return await sanityFetch({
      query: SINGLE_PROJECT_QUERY,
      params: { slug },
    });
  } catch (error) {
    console.warn(`[getProject] Network error fetching project "${slug}":`, error);
    return { data: null };
  }
});

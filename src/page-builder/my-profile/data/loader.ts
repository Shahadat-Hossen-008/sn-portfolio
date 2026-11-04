import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import { PROFILE_QUERY } from "./query";

/**
 * Deduplicates the Profile page query across route rendering and metadata.
 * Mirrors the getAboutPage pattern.
 */
export const getProfile = cache(async () => {
  try {
    return await sanityFetch({ query: PROFILE_QUERY });
  } catch (error) {
    console.warn("[getProfile] Network error fetching profile:", error);
    return { data: null };
  }
});

/** Backward-compatibility alias for getProfile. */
export const getHomePage = getProfile;

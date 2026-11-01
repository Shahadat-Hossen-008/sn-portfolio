import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import type { IMyProfilePageData } from "./interface";
import { PROFILE_QUERY } from "./query";

/** The profile singleton is shared by the home route and metadata generation. */
export const getProfile = cache(async () => {
  try {
    return await sanityFetch({ query: PROFILE_QUERY });
  } catch (error) {
    console.warn("[getProfile] Network error fetching profile:", error);
    return { data: null };
  }
});

/** Fetch home-page content. Reuses getProfile for request-scoped caching. */
export const getHomePage = cache(async (): Promise<IMyProfilePageData> => {
  const profileResult = await getProfile();
  return { profile: profileResult.data };
});

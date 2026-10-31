import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import type { IMyProfilePageData } from "./interface";
import {
  LATEST_PROJECTS_QUERY,
  PROFILE_QUERY,
} from "./query";

/** The profile singleton is shared by the home route and metadata generation. */
export const getProfile = cache(async () =>
  sanityFetch({ query: PROFILE_QUERY }),
);

/** Fetch all independent home-page content together. */
export const getHomePage = cache(async (): Promise<IMyProfilePageData> => {
  const [
    { data: profile },
    { data: latestProjects },
  ] = await Promise.all([
    getProfile(),
    sanityFetch({ query: LATEST_PROJECTS_QUERY }),
  ]);

  return { profile, latestProjects };
});

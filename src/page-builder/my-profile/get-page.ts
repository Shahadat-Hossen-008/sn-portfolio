import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import type { IMyProfilePageData } from "./interface";
import {
  ABOUT_QUERY,
  LATEST_PROJECTS_QUERY,
  PROFILE_QUERY,
  PROJECT_QUERY,
  TECH_QUERY,
} from "./query";

/** The profile singleton is shared by the home route and metadata generation. */
export const getProfile = cache(async () =>
  sanityFetch({ query: PROFILE_QUERY }),
);

/** Fetch all independent home-page content together. */
export const getHomePage = cache(async (): Promise<IMyProfilePageData> => {
  const [
    { data: profile },
    { data: projects },
    { data: about },
    { data: tech },
    { data: latestProjects },
  ] = await Promise.all([
    getProfile(),
    sanityFetch({ query: PROJECT_QUERY }),
    sanityFetch({ query: ABOUT_QUERY }),
    sanityFetch({ query: TECH_QUERY }),
    sanityFetch({ query: LATEST_PROJECTS_QUERY }),
  ]);

  return { profile, projects, about, tech, latestProjects };
});

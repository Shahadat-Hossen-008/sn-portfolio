import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import { LAYOUT_QUERY, SITE_SETTINGS_QUERY } from "./query";

/** Request-scoped settings shared by the public layout and its metadata. */
export const getLayoutSettings = cache(async () => {
  try {
    const [{ data: layout }, { data: siteSettings }] = await Promise.all([
      sanityFetch({ query: LAYOUT_QUERY }),
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
    ]);

    return { layout, siteSettings };
  } catch (error) {
    console.warn(
      "[getLayoutSettings] Network error fetching settings, falling back to defaults:",
      error,
    );
    return { layout: null, siteSettings: null };
  }
});

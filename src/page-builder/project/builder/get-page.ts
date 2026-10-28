import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import { PROJECT_PAGE_QUERY } from "./query";

/** Deduplicates the Project page query across route rendering and metadata. */
export const getProjectPage = cache(async () =>
  sanityFetch({ query: PROJECT_PAGE_QUERY }),
);

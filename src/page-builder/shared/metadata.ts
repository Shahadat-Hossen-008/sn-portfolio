import type { Metadata } from "next";

import { LAYOUT_QUERY, SITE_SETTINGS_QUERY } from "@/layout/query";
import { sanityFetch } from "@/sanity/lib/live";
import { buildMetadata, type PageSeo } from "@/lib/metadata";

/**
 * Combines page SEO with global site settings. A page SEO promise can be passed
 * so its query runs in parallel with the singleton settings queries.
 */
export async function buildPageMetadata({
  pageSeo,
  path,
}: {
  pageSeo?: PageSeo | Promise<PageSeo>;
  path: string;
}): Promise<Metadata> {
  const [resolvedPageSeo, { data: layout }, { data: siteSettings }] =
    await Promise.all([
      pageSeo,
      sanityFetch({ query: LAYOUT_QUERY }),
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
    ]);

  return buildMetadata({
    layout,
    siteSettings,
    pageSeo: resolvedPageSeo ?? undefined,
    path,
  });
}

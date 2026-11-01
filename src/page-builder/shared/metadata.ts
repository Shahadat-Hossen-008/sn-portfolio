import type { Metadata } from "next";

import { getLayoutSettings } from "@/layout/get-layout";
import { buildMetadata, type PageSeo } from "@/lib/metadata";

/**
 * Combines page SEO with global site settings. Reuses the request-scoped
 * getLayoutSettings cache to prevent duplicate queries to Sanity.
 */
export async function buildPageMetadata({
  pageSeo,
  path,
}: {
  pageSeo?: PageSeo | Promise<PageSeo>;
  path: string;
}): Promise<Metadata> {
  const [resolvedPageSeo, { layout, siteSettings }] = await Promise.all([
    Promise.resolve(pageSeo).catch((err) => {
      console.warn(`[buildPageMetadata] Failed to load SEO for ${path}:`, err);
      return null;
    }),
    getLayoutSettings(),
  ]);

  return buildMetadata({
    layout,
    siteSettings,
    pageSeo: resolvedPageSeo ?? undefined,
    path,
  });
}

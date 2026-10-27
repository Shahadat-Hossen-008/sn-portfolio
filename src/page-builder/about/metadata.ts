import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { buildPageMetadata } from "@/page-builder/shared/metadata";
import { getRedirectTarget } from "@/lib/metadata";
import { getAboutPage } from "./get-page";

export async function generateAboutMetadata(): Promise<Metadata> {
  const pageResult = getAboutPage();
  const [{ data: aboutPage }, metadata] = await Promise.all([
    pageResult,
    buildPageMetadata({
      pageSeo: pageResult.then(({ data }) => data?.seo),
      path: "/about",
    }),
  ]);

  const redirectTarget = getRedirectTarget(aboutPage?.seo);

  if (redirectTarget) redirect(redirectTarget);

  return metadata;
}

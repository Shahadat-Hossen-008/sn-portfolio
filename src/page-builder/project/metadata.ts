import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getRedirectTarget } from "@/lib/metadata";
import { buildPageMetadata } from "@/page-builder/shared/metadata";
import { getProjectPage } from "./builder/get-page";

export async function generateProjectMetadata(): Promise<Metadata> {
  const projectPageResult = getProjectPage();
  const [{ data: projectPage }, metadata] = await Promise.all([
    projectPageResult,
    buildPageMetadata({
      pageSeo: projectPageResult.then(({ data }) => data?.seo),
      path: "/projects",
    }),
  ]);

  const redirectTarget = getRedirectTarget(projectPage?.seo);

  if (redirectTarget) redirect(redirectTarget);

  return metadata;
}

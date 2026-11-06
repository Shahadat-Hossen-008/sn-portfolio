import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { buildPageMetadata } from "@/page-builder/shared/metadata";
import { getRedirectTarget } from "@/lib/metadata";
import { getProject } from "../data/loader";

export async function generateProjectDetailsMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const projectResult = getProject(slug);
  const [{ data: project }, metadata] = await Promise.all([
    projectResult,
    buildPageMetadata({
      pageSeo: projectResult.then(({ data }) => data?.seo),
      path: `/project/${slug}`,
    }),
  ]);

  if (!project) notFound();

  const redirectTarget = getRedirectTarget(project.seo);
  if (redirectTarget) redirect(redirectTarget);

  return metadata;
}

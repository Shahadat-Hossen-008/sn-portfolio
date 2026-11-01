import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { buildPageMetadata } from "@/page-builder/shared/metadata";
import { getRedirectTarget } from "@/lib/metadata";
import { getBlogPost } from "../data/loader";

export async function generateBlogDetailsMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const postResult = getBlogPost(slug);
  const [{ data: post }, metadata] = await Promise.all([
    postResult,
    buildPageMetadata({
      pageSeo: postResult.then(({ data }) => data?.seo),
      path: `/blog/${slug}`,
    }),
  ]);

  if (!post) notFound();

  const redirectTarget = getRedirectTarget(post.seo);

  if (redirectTarget) redirect(redirectTarget);

  return metadata;
}

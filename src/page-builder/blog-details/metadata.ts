import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { buildPageMetadata } from "@/page-builder/shared/metadata";
import { getRedirectTarget } from "@/lib/metadata";
import { getBlogPost } from "./get-page";
import type { IBlogPostPageProps } from "./interface";

export async function generateBlogDetailsMetadata({
  params,
}: IBlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const postResult = getBlogPost(slug);
  const [{ data: blog }, metadata] = await Promise.all([
    postResult,
    buildPageMetadata({
      pageSeo: postResult.then(({ data }) => data?.seo),
      path: `/blog/${slug}`,
    }),
  ]);

  const redirectTarget = getRedirectTarget(blog?.seo);

  if (redirectTarget) redirect(redirectTarget);

  return metadata;
}

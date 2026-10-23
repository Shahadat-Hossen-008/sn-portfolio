import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { LAYOUT_QUERY, SITE_SETTINGS_QUERY } from "@/layout/query";
import { sanityFetch } from "@/sanity/lib/live";
import {
  buildMetadata,
  getRedirectTarget,
  type PageSeo,
} from "@/sanity/lib/metadata";
import { BlogDetailsBuilder } from "@/sections/blogs/blog-details/builder";
import type { IBlogPostPageProps } from "./interface";
import { SINGLE_BLOG_POST_QUERY } from "./query";

/**
 * Redirect is handled here rather than inside `buildMetadata`, so the
 * navigation call is visible at the call site and `buildMetadata` stays a pure
 * mapper (see `getRedirectTarget`).
 */
export async function generateMetadata({
  params,
}: IBlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  const [{ data: blog }, { data: layout }, { data: siteSettings }] =
    await Promise.all([
      sanityFetch({ query: SINGLE_BLOG_POST_QUERY, params: { slug } }),
      sanityFetch({ query: LAYOUT_QUERY }),
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
    ]);

  const redirectTarget = getRedirectTarget(blog?.seo);

  if (redirectTarget) redirect(redirectTarget);

  return buildMetadata({
    layout,
    siteSettings,
    pageSeo: (blog?.seo ?? undefined) as PageSeo | undefined,
    path: `/blog/${slug}`,
  });
}

export default async function page({ params }: IBlogPostPageProps) {
  const { slug } = await params;
  const { data: blog } = await sanityFetch({
    query: SINGLE_BLOG_POST_QUERY,
    params: { slug: slug },
  });

  if (!blog) notFound();

  return <BlogDetailsBuilder blog={blog} />;
}

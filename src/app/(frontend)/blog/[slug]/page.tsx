import { portableTextComponents } from "@/components/portableText/PortableTextComponent";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import {
  buildMetadata,
  getRedirectTarget,
  type PageSeo,
} from "@/sanity/lib/metadata";
import {
  LAYOUT_QUERY,
  SITE_SETTINGS_QUERY,
  SINGLE_BLOG_POST_QUERY,
} from "@/sanity/lib/queries";
import { formatDate } from "@/sanity/lib/formatDate";
import { PortableText } from "next-sanity";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Redirect is handled here rather than inside `buildMetadata`, so the
 * navigation call is visible at the call site and `buildMetadata` stays a pure
 * mapper (see `getRedirectTarget`).
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
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

export default async function page({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const { data: blog } = await sanityFetch({
    query: SINGLE_BLOG_POST_QUERY,
    params: { slug: slug },
  });

  if (!blog) notFound();

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-40 pt-20 pb-4 lg:pb-20 bg-background text-foreground">
      <Link
        href="/blog"
        className="text-forest bg-limestone px-4 py-3 rounded-lg mb-6 inline-block transition duration-300 hover:bg-soft-limestone"
      >
        Back to Blogs
      </Link>
      <h2 className="text-2xl lg:text-5xl font-bold py-5">{blog.blogTitle}</h2>
      {formatDate(blog.publishedAt) && (
        <p className="text-muted-foreground text-sm pb-6">
          {formatDate(blog.publishedAt)}
        </p>
      )}
      {blog.mainImage?.imageFile && (
        <div className="w-full h-full rounded-lg pb-8">
          <Image
            src={urlFor(blog.mainImage.imageFile).width(800).height(520).url()}
            alt={blog.mainImage.altText || blog.blogTitle || "Blog image"}
            width={800}
            height={520}
            className="rounded-lg w-full h-full"
            unoptimized
          />
        </div>
      )}
      {blog.blogContent && (
        <PortableText
          value={blog.blogContent}
          components={portableTextComponents}
        />
      )}
    </section>
  );
}
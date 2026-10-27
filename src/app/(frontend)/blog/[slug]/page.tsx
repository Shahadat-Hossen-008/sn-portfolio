import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogDetailsPageBuilder } from "@/page-builder/blog-details";
import { getBlogPost } from "@/page-builder/blog-details/get-page";
import type { IBlogPostPageProps } from "@/page-builder/blog-details/interface";
import { generateBlogDetailsMetadata } from "@/page-builder/blog-details/metadata";

export async function generateMetadata({
  params,
}: IBlogPostPageProps): Promise<Metadata> {
  return generateBlogDetailsMetadata({ params });
}

export default async function BlogPostPage({ params }: IBlogPostPageProps) {
  const { slug } = await params;
  const { data: blog } = await getBlogPost(slug);

  if (!blog) notFound();

  return <BlogDetailsPageBuilder blog={blog} />;
}

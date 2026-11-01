import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  BlogDetailsPageBuilder,
  generateBlogDetailsMetadata,
  getBlogPost,
  type IBlogPostPageProps,
} from "@/page-builder/blog-details";

export async function generateMetadata(
  props: IBlogPostPageProps,
): Promise<Metadata> {
  return generateBlogDetailsMetadata(props);
}

export default async function BlogPostPage({ params }: IBlogPostPageProps) {
  const { slug } = await params;
  const { data: blogPost } = await getBlogPost(slug);

  if (!blogPost) {
    notFound();
  }

  return <BlogDetailsPageBuilder post={blogPost} />;
}

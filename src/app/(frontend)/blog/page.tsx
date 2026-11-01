import type { Metadata } from "next";

import {
  BlogPageBuilder,
  generateBlogMetadata,
  getBlogPosts,
} from "@/page-builder/blog";

export async function generateMetadata(): Promise<Metadata> {
  return generateBlogMetadata();
}

export default async function Blog() {
  const { data: blogPosts } = await getBlogPosts();

  return <BlogPageBuilder posts={blogPosts} />;
}

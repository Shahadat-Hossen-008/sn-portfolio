import { BlogPageBuilder } from "@/page-builder/blog";
import { getBlogPosts } from "@/page-builder/blog/get-page";

export default async function Blog() {
  const { data: blogPosts } = await getBlogPosts();

  return <BlogPageBuilder posts={blogPosts} />;
}

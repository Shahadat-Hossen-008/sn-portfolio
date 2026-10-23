import { sanityFetch } from "@/sanity/lib/live";
import { BlogCardBuilder } from "@/sections/blogs/blog-card/builder";
import { BLOG_POSTS_QUERY } from "./query";

export default async function Blog() {
  const { data: blogPosts } = await sanityFetch({ query: BLOG_POSTS_QUERY });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-20 pt-20 pb-4 lg:pb-20 bg-background text-foreground">
      <h2 className="text-2xl sm:text-4xl font-bold pb-8">Blogs</h2>
      {blogPosts?.map((blogPost) => (
        <BlogCardBuilder key={blogPost._id} blogPost={blogPost} />
      ))}
    </div>
  );
}

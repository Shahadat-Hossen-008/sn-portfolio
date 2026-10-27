import { BlogCardBuilder } from "@/sections/blogs/blog-card/builder";
import type { IBlogPageBuilderProps } from "./interface";

export function BlogPageBuilder({ posts }: IBlogPageBuilderProps) {
  return (
    <div className="container mx-auto bg-background px-4 pt-20 pb-4 text-foreground sm:px-6 lg:px-20 lg:pb-20">
      <h2 className="pb-8 text-2xl font-bold sm:text-4xl">Blogs</h2>
      {posts?.map((blogPost) => (
        <BlogCardBuilder key={blogPost._id} blogPost={blogPost} />
      ))}
    </div>
  );
}

export default BlogPageBuilder;

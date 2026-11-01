import { BlogDetailsBuilder } from "@/sections/blogs/blog-details/builder";
import type { IBlogDetailsPageBuilderProps } from "./interface";

export function BlogDetailsPageBuilder({
  blog,
}: IBlogDetailsPageBuilderProps) {
  return <BlogDetailsBuilder blog={blog} />;
}

export default BlogDetailsPageBuilder;

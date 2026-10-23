import { formatDate } from "@/sanity/lib/formatDate";
import { BlogDetails } from "../index";
import type { IBlogDetailsProps } from "../interface";
import type { ISanityBlogDetailsProps } from "./interface";

export function BlogDetailsBuilder({ blog }: ISanityBlogDetailsProps) {
  const props: IBlogDetailsProps = {
    blogTitle: blog.blogTitle,
    publishedDate: formatDate(blog.publishedAt),
    mainImage: blog.mainImage,
    blogContent: blog.blogContent,
  };

  return <BlogDetails {...props} />;
}

export default BlogDetailsBuilder;

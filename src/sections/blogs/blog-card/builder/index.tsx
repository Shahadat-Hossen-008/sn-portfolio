import { formatDate } from "@/sanity/lib/formatDate";
import { BlogCard } from "../index";
import type { IBlogCardProps } from "../interface";
import type { ISanityBlogCardProps } from "./interface";

export function BlogCardBuilder({ blogPost }: ISanityBlogCardProps) {
  if (!blogPost) return null;

  const { blogContent, blogTitle, slug, mainImage, publishedAt } = blogPost;

  // Prevent runtime crash if slug is missing
  if (!slug?.current) return null;

  const props: IBlogCardProps = {
    slug: slug.current,
    blogTitle: blogTitle || "Untitled",
    publishedDate: formatDate(publishedAt),
    mainImage,
    blogContent,
  };

  return <BlogCard {...props} />;
}

export default BlogCardBuilder;

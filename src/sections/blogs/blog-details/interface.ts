import type { SINGLE_BLOG_POST_QUERYResult } from "@/sanity/types";

export type SingleBlogPost = NonNullable<SINGLE_BLOG_POST_QUERYResult>;

export interface IBlogDetailsProps {
  blogTitle: SingleBlogPost["blogTitle"];
  publishedDate: string | null;
  mainImage: SingleBlogPost["mainImage"];
  blogContent: SingleBlogPost["blogContent"];
}

import type { BLOG_POSTS_QUERYResult } from "@/sanity/types";

export type BlogPost = BLOG_POSTS_QUERYResult[number];

export interface IBlogCardProps {
  slug: string;
  blogTitle: string;
  publishedDate: string | null;
  mainImage: BlogPost["mainImage"];
  blogContent: BlogPost["blogContent"];
}

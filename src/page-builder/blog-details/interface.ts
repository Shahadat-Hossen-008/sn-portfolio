import type { SINGLE_BLOG_POST_QUERYResult } from "@/sanity/types";

export type BlogPost = NonNullable<SINGLE_BLOG_POST_QUERYResult>;

export interface IBlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export interface IBlogDetailsPageBuilderProps {
  blog: BlogPost;
}

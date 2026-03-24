import { BLOG_POSTS_QUERYResult } from "@/sanity/types";

export type BlogPost = BLOG_POSTS_QUERYResult[number];

export type BlogsProps = {
  blogPost: BlogPost;
};

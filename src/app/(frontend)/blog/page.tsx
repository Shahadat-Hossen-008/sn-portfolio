import Blogs from "@/components/blogs/Blog";
import { sanityFetch } from "@/sanity/lib/live";
import { BLOG_POSTS_QUERY } from "@/sanity/lib/queries";

export default async function Blog() {
  const { data: blogPosts } = await sanityFetch({ query: BLOG_POSTS_QUERY });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-4 lg:py-20">
      <h2 className="text-2xl sm:text-4xl font-bold pb-8">Blogs</h2>
      {blogPosts.map((blogPost) => (
        <Blogs key={blogPost._id} blogPost={blogPost} />
      ))}
    </div>
  );
}

import { sanityFetch } from "@/sanity/lib/live";
import { SINGLE_BLOG_POST_QUERY } from "@/sanity/lib/queries";

export default async function page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const { data: blog } = await sanityFetch({
    query: SINGLE_BLOG_POST_QUERY,
    params: { slug: slug },
  });
  console.log(blog);

  return <div>page</div>;
}

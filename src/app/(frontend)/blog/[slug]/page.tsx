import { portableTextComponents } from "@/components/portableText/PortableTextComponent";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { SINGLE_BLOG_POST_QUERY } from "@/sanity/lib/queries";
import { format, parseISO } from "date-fns";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
export default async function page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const { data: blog } = await sanityFetch({
    query: SINGLE_BLOG_POST_QUERY,
    params: { slug: slug },
  });

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-40 py-4 lg:py-20 bg-black text-white">
      <Link
        href={"/blog"}
        className="text-black bg-white px-4 py-3 rounded-lg mb-6 inline-block transition duration-300 hover:bg-gray-200"
      >
        Back to Blogs
      </Link>
      <h2 className="text-2xl lg:text-5xl font-bold py-5">{blog.blogTitle}</h2>
      <p className="text-gray-300 text-sm pb-6">
        {format(parseISO(blog.publishedAt), "LLL d, yyyy")}
      </p>
      <div className="w-full h-full rounded-lg pb-8">
        <Image
          src={urlFor(blog.mainImage.imageFile).width(800).height(520).url()}
          alt={blog.blogTitle || "Blog image"}
          width={800}
          height={520}
          className="rounded-lg w-full h-full"
          unoptimized
        />
      </div>
      <PortableText
        value={blog.blogContent}
        components={portableTextComponents}
      />
    </section>
  );
}

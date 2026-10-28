import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";

import { createPortableTextComponents } from "@/components/portable-text";
import { urlFor } from "@/sanity/lib/image";
import type { IBlogDetailsProps } from "./interface";

export function BlogDetails({
  blogTitle,
  publishedDate,
  mainImage,
  blogContent,
}: IBlogDetailsProps) {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-40 pt-20 pb-4 lg:pb-20 bg-background text-foreground">
      <Link
        href="/blog"
        className="text-forest bg-limestone px-4 py-3 rounded-lg mb-6 inline-block transition duration-300 hover:bg-soft-limestone"
      >
        Back to Blogs
      </Link>
      <h2 className="text-2xl lg:text-5xl font-bold py-5">{blogTitle}</h2>
      {publishedDate && (
        <p className="text-muted-foreground text-sm pb-6">
          {publishedDate}
        </p>
      )}
      {mainImage?.imageFile && (
        <div className="w-full h-full rounded-lg pb-8">
          <Image
            src={urlFor(mainImage.imageFile).width(800).height(520).url()}
            alt={mainImage.altText || blogTitle || "Blog image"}
            width={800}
            height={520}
            className="rounded-lg w-full h-full"
            unoptimized
          />
        </div>
      )}
      {blogContent && (
        <PortableText
          value={blogContent}
          components={createPortableTextComponents(blogContent)}
        />
      )}
    </section>
  );
}

export default BlogDetails;

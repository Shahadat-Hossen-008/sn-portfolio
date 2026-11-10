import Image from "next/image";
import Link from "next/link";

import { CustomPortableText } from "@/components/portable-text";
import { urlFor } from "@/sanity/lib/image";
import type { IBlogDetailsProps } from "./interface";

export function BlogDetails({
  blogTitle,
  publishedDate,
  mainImage,
  blogContent,
}: IBlogDetailsProps) {
  return (
    <article className="bg-background text-foreground px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-16 lg:pb-24">
      <div className="mx-auto w-full max-w-article">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:-translate-x-1"
          >
            ←
          </span>
          <span className="link-hover-underline">Back to Blogs</span>
        </Link>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-balance text-foreground leading-[1.1] tracking-tight">
          {blogTitle}
        </h1>

        {publishedDate && (
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground pb-8">
            {publishedDate}
          </p>
        )}

        {mainImage?.imageFile && (
          <figure className="w-full pb-10">
            <Image
              src={urlFor(mainImage.imageFile).width(1200).height(750).url()}
              alt={mainImage.altText || blogTitle || "Blog image"}
              width={1200}
              height={750}
              className="w-full h-auto rounded-xl border border-foreground/10 object-cover"
              unoptimized
            />
          </figure>
        )}

        {blogContent && <CustomPortableText value={blogContent} />}
      </div>
    </article>
  );
}

export default BlogDetails;

import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";

import { previewPortableTextComponents } from "@/components/preview-portable-text";
import { urlFor } from "@/sanity/lib/image";
import type { IBlogCardProps } from "./interface";

export function BlogCard({
  slug,
  blogTitle,
  publishedDate,
  mainImage,
  blogContent,
}: IBlogCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="p-4 bg-background/80 transition duration-300 underline-offset-2 hover:underline"
    >
      <div className="flex items-start gap-5">
        {mainImage?.imageFile && (
          <div className="flex-1 h-80 rounded-lg">
            <Image
              src={urlFor(mainImage.imageFile).width(800).height(320).url()}
              alt={blogTitle || "Blog image"}
              width={800}
              height={320}
              className="rounded-lg w-full h-full"
              unoptimized
            />
          </div>
        )}

        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-2">{blogTitle}</h2>
          {publishedDate && (
            <p className="text-muted-foreground text-sm">
              Published on {publishedDate}
            </p>
          )}

          {blogContent && (
            <div className="text-sm text-muted-foreground mb-4 line-clamp-8">
              <PortableText
                value={blogContent}
                components={previewPortableTextComponents}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default BlogCard;

import { BlogsProps } from "@/app/types/blogTypes";
import { urlFor } from "@/sanity/lib/image";
import { format, parseISO } from "date-fns";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { previewPortableTextComponents } from "../previewPortableText/PreviewPortableText";

export default function Blogs({ blogPost }: BlogsProps) {
  if (!blogPost) return null;

  const { blogContent, blogTitle, slug, mainImage, publishedAt } = blogPost;

  // Prevent runtime crash if slug is missing
  if (!slug?.current) return null;

  return (
    <Link
      href={`/blog/${slug.current}`}
      className="p-4 bg-black/30 transition duration-300 underline-offset-2 hover:underline"
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
          <h2 className="text-2xl font-bold mb-2">{blogTitle || "Untitled"}</h2>
          {publishedAt && (
            <p className="text-gray-300 text-sm">
              Published on {format(parseISO(publishedAt), "LLL d, yyyy")}
            </p>
          )}

          {blogContent && (
            <div className="text-sm text-gray-200 mb-4 line-clamp-8">
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

import { BlogsProps } from "@/app/types/blogTypes";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";

export default function Blogs({ blogPost }: BlogsProps) {
  if (!blogPost) return null;

  const { blogContent, blogTitle, slug, mainImage } = blogPost;

  // Prevent runtime crash if slug is missing
  if (!slug?.current) return null;

  return (
    <Link
      href={`/blogs/${slug.current}`}
      className="p-4 bg-black/30 hover:bg-black/40 transition-colors duration-300 underline-offset-2 hover:underline"
    >
      <div className="flex items-start gap-5">
        {mainImage && (
          <div className="flex-1 h-80 rounded-lg">
            <Image
              src={urlFor(mainImage).width(800).height(320).url()}
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

          {blogContent && (
            <div className="text-sm text-gray-400 mb-4 line-clamp-8">
              <PortableText value={blogContent} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

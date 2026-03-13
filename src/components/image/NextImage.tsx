import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { imageProp } from "../../app/types/imagePropType";

/**
 * How Sanity builds the `src` URL
 * 1. `urlFor(image)` — calls `builder.image(source)` from `@sanity/image-url`.
 *    The builder is initialised with `projectId` and `dataset`, resolving to:
 *    `https://cdn.sanity.io/images/{projectId}/{dataset}/{assetId}`
 *
 * 2. `.width(w).height(h)` — appends `?w=…&h=…` so the CDN serves a
 *    pre-cropped / resized image instead of the original asset.
 *
 * 3. `.url()` — serialises the builder chain into the final string passed
 *    to Next.js `<Image src={…} />`.
 *   - Next.js serves the image from `/_next/image?url=…` and converts it
 */
export default function SanityNextImage({
  image,
  alt,
  width,
  height,
  className,
}: imageProp) {
  if (!image || !width || !height) return null;

  return (
    <Image
      src={urlFor(image).width(width).height(height).url()}
      alt={`portfolio of ${alt}`}
      width={width}
      height={height}
      className={className}
      quality={75}
    />
  );
}

import { urlFor } from "@/sanity/lib/image";
import { imageProp } from "../../app/types/imagePropType";

export default function SanityImage({
  image,
  alt,
  width,
  height,
  className,
}: imageProp) {
  if (!image || !width || !height) return null;

  return (
    <picture>
      <source
        srcSet={urlFor(image)
          .auto("format")
          .quality(75)
          .width(width)
          .height(height)
          .url()}
        type="image/webp" /**only tells the browser what the resource *is**/
      />
      <img
        src={urlFor(image)
          .auto("format") /* Sanity will pick the format automatically. */
          .quality(80)
          .width(width)
          .height(height)
          .url()}
        alt={`portfolio of ${alt}`}
        width={width}
        height={height}
        className={className}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

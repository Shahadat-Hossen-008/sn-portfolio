import { urlFor } from "@/sanity/lib/image";
import { imageProp } from "../../app/types/imagePropType";

/**
 * How Sanity builds the `src` URL
 * 1. `urlFor(image)` — calls `builder.image(source)` from `@sanity/image-url`.
 *    The builder is initialised with the project's `projectId` and `dataset`,
 *    so it knows which Sanity CDN origin to target:
 *    `https://cdn.sanity.io/images/{projectId}/{dataset}/{assetId}`
 *
 * 2. `.auto("format")` — lets the Sanity Image API pick the best format
 *    (WebP, AVIF, etc.) based on the `Accept` header sent by the browser.
 *
 * 3. `.quality(n)` — appends `?q=n` to control lossy compression (0-100).
 *
 * 4. `.width(w).height(h)` — appends `?w=…&h=…` so the CDN returns a
 *    resized image rather than the original full-resolution asset.
 *
 * 5. `.url()` — serialises all of the above into the final URL string that
 *    is used as `srcSet` / `src`.
 */
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

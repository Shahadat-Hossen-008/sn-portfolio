import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

/**
 * Props for the Sanity image renderer in `components/image`.
 *
 * Accepts any valid Sanity image source (raw schema object, dereferenced projection,
 * or asset reference) compatible with `urlFor`.
 */
export interface ISanityImageProps {
  image: SanityImageSource;
  width?: number | null;
  height?: number | null;
  alt?: string;
  className?: string;
}

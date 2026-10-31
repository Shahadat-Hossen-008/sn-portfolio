import type { CustomImage } from "@/sanity/types";

/**
 * Props for the Sanity image renderer in `components/image`.
 *
 * Derived from the generated `customImage` object type, which is what every
 * call site passes.
 */
export interface ISanityImageProps {
  image: CustomImage["imageFile"];
  width?: number | null;
  height?: number | null;
  alt?: string;
  className?: string;
}

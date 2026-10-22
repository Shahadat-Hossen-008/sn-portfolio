import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export type SanityImageRef = {
  imageFile?: (SanityImageSource & { asset?: unknown }) | null;
  altText?: string | null;
} | null;

/** `true` when the object carries a usable Sanity image asset reference. */
export function hasSanityImage(image: SanityImageRef | undefined): boolean {
  return Boolean(image?.imageFile);
}

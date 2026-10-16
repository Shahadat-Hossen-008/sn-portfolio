import { CustomImage } from "@/sanity/types";

/**
 * Props shared by the two Sanity image renderers in `components/image`.
 *
 * NOTE: this used to be derived from `PROFILE_QUERYResult["image"]`, which
 * coupled a generic image prop to one page query. It is now derived from the
 * generated `customImage` object type, which is what every call site passes.
 */
export type imageProp = {
  image: CustomImage["imageFile"];
  width?: number | null;
  height?: number | null;
  alt?: string;
  className?: string;
};
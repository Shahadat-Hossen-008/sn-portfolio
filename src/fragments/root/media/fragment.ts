/**
 * Shared root GROQ projections for Sanity image and customImage objects.
 * Projects the dereferenced asset with dimensions, plus crop, hotspot, and metadata.
 */

export const IMAGE_FILE_FRAGMENT = /* groq */ `
  asset->{
    _id,
    url,
    metadata {
      dimensions {
        width,
        height
      }
    }
  },
  crop,
  hotspot
`;

export const CUSTOM_IMAGE_FRAGMENT = /* groq */ `
  imageFile {
    ${IMAGE_FILE_FRAGMENT}
  },
  altText,
  isClickable,
  linkUrl
`;

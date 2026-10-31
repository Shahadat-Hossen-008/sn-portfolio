import { PORTABLE_TEXT_PROJECTION } from "@/fragments";

export const BLOG_DETAILS_FRAGMENT = /* groq */ `
  _id,
  _createdAt,
  blogTitle,
  slug,
  mainImage,
  categories[]->{_id, title},
  author,
  publishedAt,
  "blogContent": blogContent${PORTABLE_TEXT_PROJECTION}
`;

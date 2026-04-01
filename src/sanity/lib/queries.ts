import { defineQuery } from "next-sanity";

// Query to fetch profile data
export const PROFILE_QUERY = defineQuery(`*[_type == "profilePage"][0]{
  fullName,
  headline,
  "imageUrl": image.asset->url,
  "cvUrl": uploadCV.asset->url,
  'bio' :bio
}`);

export const ABOUT_QUERY = defineQuery(`*[_type == "aboutPage"][0]{
   description,  socialLinks[]{label, url, icon, _key}, technologies[]->{label, _id}
}`);

export const BLOG_POSTS_QUERY = defineQuery(`*[_type == "blogPost"]{
  _id,
  _createdAt,
  title,
  slug,
  mainImage,
  categories[]->{
    _id,
    label
  },
  author,
  publishedAt,
  blogContent
}`);

export const SINGLE_BLOG_POST_QUERY = defineQuery(`*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  _createdAt,
  title,
  slug,
  mainImage,
  categories[]->{
    _id,
    label
  },
  author,
  publishedAt,
  blogContent
}`);

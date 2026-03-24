import { defineQuery } from "next-sanity";

export const PROFILE_QUERY = defineQuery(`*[_type == "profilePage"][0]{
  fullName,
  headline,
  "imageUrl": image.asset->url,
  "cvUrl": uploadCV.asset->url,
  'bio' :bio
}`);

export const BLOG_POSTS_QUERY = defineQuery(`*[_type == "blogPost"][]{
  blogTitle, _id, author, slug, categories[]->{
  _id,
  title,
  icon{
    alt,
    asset
  }
}, publishedAt, mainImage, blogContent
}`);

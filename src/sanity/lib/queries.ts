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
  "description" : description, "socialIcons": socialLinks[]{label, url, "imageIcon": icon.asset->url, _key}, technologies[]->{label, _id}
}`);

export const PROJECTS_QUERY = defineQuery(`*[_type == "tag"][]{
  _id, label, "labelIcon": icon.asset -> url 
}`);

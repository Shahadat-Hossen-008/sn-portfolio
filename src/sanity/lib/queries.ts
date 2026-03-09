import { defineQuery } from "next-sanity";

// Query to fetch profile data
export const PROFILE_QUERY = defineQuery(`*[_type == "profilePage"][0]{
  fullName,
  headline,
  "imageUrl": image.asset->url,
  "cvUrl": uploadCV.asset->url,
  'bio' :bio[0].children[0].text
}`);


export const ABOUT_QUERY = defineQuery(`*[_type == "aboutPage"][0]{
  "description" :  pt::text(description), "socialIcons": socialLinks[]{label, url, "imageIcon": icon.asset->url, _key}, technologies[]->{label, _id}
}`);
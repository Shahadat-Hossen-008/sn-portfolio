import { defineQuery } from "next-sanity";

export const PROFILE_QUERY = defineQuery(`*[_type == "profilePage"][0]{
  fullName,
  headline,
  image,
  "cvUrl": uploadCV.asset->url,
  'bio' :bio
}`);

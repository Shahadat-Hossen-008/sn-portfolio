import { defineQuery } from "next-sanity";

// Query to fetch profile data
export const PROFILE_QUERY = defineQuery(`*[_type == "profilePage"][0]{
  fullName,
  headline,
  image,
  "cvUrl": uploadCV.asset->url,
  'bio' :bio
}`);

export const ABOUT_QUERY = defineQuery(`*[_type == "aboutPage"][0]{
  description,  socialLinks[]{label, url, icon, _key}, technologies[]->{label, _id}
}`);

export const PROJECT_QUERY = defineQuery(`*[_type == "project"][]{
  _id, projectDescription, start, end, githubUrl, projectImage, projectLink, projectTitle 
}`);


export const TECH_QUERY = defineQuery(`*[_type == "tag"][]{
  _id, label, iconImage 
}`);
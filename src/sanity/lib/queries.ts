import { defineQuery } from "next-sanity";

export const PROFILE_QUERY = defineQuery(`*[_type == "profilePage"][0]{
  fullName,
  headline,
  "imageUrl": image.asset->url,
  "cvUrl": uploadCV.asset->url,
  'bio' :bio
}`);

export const PROJECT_QUERY = defineQuery(`*[_type == "project"][]{
  _id, projectDescription, start, end, githubUrl, "projectImage": projectImage.asset -> url, projectLink, projectTitle 
}`)

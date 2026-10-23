import { PORTABLE_TEXT_PROJECTION } from "@/fragments";

export const PROJECT_SECTION_FRAGMENT = /* groq */ `
  _id,
  "projectDescription": projectDescription${PORTABLE_TEXT_PROJECTION},
  start,
  end,
  githubUrl,
  projectImage,
  projectLink,
  projectTitle
`;

export const LATEST_PROJECTS_FRAGMENT = /* groq */ `
  _id,
  "title": projectTitle,
  date,
  "technologies": stack[]->{_id, "name": label}
`;

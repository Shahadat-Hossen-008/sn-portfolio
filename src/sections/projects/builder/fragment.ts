import { CUSTOM_IMAGE_FRAGMENT } from "@/fragments";

export const PROJECT_SECTION_FRAGMENT = /* groq */ `
  _id,
  projectTitle,
  "slug": slug.current,
  projectDescription,
  start,
  end,
  liveLink,
  githubUrl,
  projectImage {
    ${CUSTOM_IMAGE_FRAGMENT}
  },
  "stack": stack[]->{ _id, label }
`;

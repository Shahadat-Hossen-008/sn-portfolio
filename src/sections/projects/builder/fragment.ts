import { LINK_REFERENCE_FRAGMENT } from "@/fragments";

export const PROJECT_SECTION_FRAGMENT = /* groq */ `
  _id,
  projectTitle,
  projectType,
  status,
  role,
  projectDescription,
  problemStatement,
  start,
  end,
  liveLink,
  githubUrl,
  projectImage,
  caseStudy {
    label,
    type,
    url,
    openInNewTab,
    isDisabled,
    ${LINK_REFERENCE_FRAGMENT}
  },
  "stack": stack[]->{ _id, label }
`;

export const LATEST_PROJECTS_FRAGMENT = /* groq */ `
  _id,
  "title": projectTitle,
  date,
  "technologies": stack[]->{_id, "name": label}
`;

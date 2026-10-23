import { curiositySectionFragment } from "@/sections/curiosity/builder/fragment";

export const PAGE_SECTIONS_FRAGMENT = /* groq */ `
  "curiosity": (pageSections[]->[_type == "curiositySection"])[0]${curiositySectionFragment}
`;

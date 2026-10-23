import { PORTABLE_TEXT_PROJECTION } from "@/fragments";

export const ABOUT_SECTION_FRAGMENT = /* groq */ `
  "description": pageSections[_type == "richTextSection"][0].content${PORTABLE_TEXT_PROJECTION},
  "technologies": pageSections[_type == "technologySection" || _type == "technologyCarousel"].technology[]{"label": title}
`;

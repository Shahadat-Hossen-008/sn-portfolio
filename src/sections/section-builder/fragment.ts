import { aboutBuilderSectionFragment } from "@/sections/about-builder/builder/fragment";
import { curiositySectionFragment } from "@/sections/curiosity/builder/fragment";

/**
 * The ordered `pageSections` array, dereferenced. Each block carries its
 * `_type` and a per-type projection, so the page renders exactly what the
 * editor added, in Studio order. Dereference first (`pageSections[]->`), then
 * project; filtering inside `[]->[...]` returns null in real GROQ.
 */
export const PAGE_SECTIONS_FRAGMENT = /* groq */ `
  "sections": pageSections[]->{
    _id,
    _type,
    _type == "curiositySection" => ${curiositySectionFragment},
    _type == "aboutBuilderSection" => ${aboutBuilderSectionFragment}
  }
`;

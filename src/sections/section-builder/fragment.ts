import { aboutBuilderSectionFragment } from "@/sections/about-builder/builder/fragment";
import { ctaSectionFragment } from "@/sections/cta/builder/fragment";
import { curiositySectionFragment } from "@/sections/curiosity/builder/fragment";
import { experienceSectionFragment } from "@/sections/experience/builder/fragment";
import { processSectionFragment } from "@/sections/process/builder/fragment";
import { quoteSectionFragment } from "@/sections/quote/builder/fragment";

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
    _type == "aboutBuilderSection" => ${aboutBuilderSectionFragment},
    _type == "quoteSection" => ${quoteSectionFragment},
    _type == "processSection" => ${processSectionFragment},
    _type == "experienceSection" => ${experienceSectionFragment},
    _type == "ctaSection" => ${ctaSectionFragment}
  }
`;

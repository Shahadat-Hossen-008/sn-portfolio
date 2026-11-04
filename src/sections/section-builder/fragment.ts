import { ctaSectionFragment } from "@/sections/cta/builder/fragment";
import { engineeringPillarsFragment } from "@/sections/engineering-pillars/builder/fragment";
import { experienceSectionFragment } from "@/sections/experience/builder/fragment";
import { personalIntroSectionFragment } from "@/sections/personal-intro/builder/fragment";
import { philosophySectionFragment } from "@/sections/philosophy/builder/fragment";
import { quoteSectionFragment } from "@/sections/quote/builder/fragment";
import { technicalFoundationFragment } from "@/sections/technical-foundation/builder/fragment";

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
    _type == "personalIntroSection" => ${personalIntroSectionFragment},
    _type == "engineeringPillars" => ${engineeringPillarsFragment},
    _type == "technicalFoundation" => ${technicalFoundationFragment},
    _type == "philosophySection" => ${philosophySectionFragment},
    _type == "quoteSection" => ${quoteSectionFragment},
    _type == "experienceSection" => ${experienceSectionFragment},
    _type == "ctaSection" => ${ctaSectionFragment}
  }
`;

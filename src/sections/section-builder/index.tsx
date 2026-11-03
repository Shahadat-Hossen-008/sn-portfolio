import { CtaSectionBuilder } from "@/sections/cta/builder";
import { EngineeringPillarsSectionBuilder } from "@/sections/engineering-pillars/builder";
import { ExperienceSectionBuilder } from "@/sections/experience/builder";
import { PersonalIntroSectionBuilder } from "@/sections/personal-intro/builder";
import { PhilosophySectionBuilder } from "@/sections/philosophy/builder";
import { QuoteSectionBuilder } from "@/sections/quote/builder";
import { TechnicalFoundationSectionBuilder } from "@/sections/technical-foundation/builder";
import type { ISectionBuilderProps } from "./interface";

/**
 * Dynamic dispatcher for CMS `pageSections` blocks.
 *
 * Dispatches each block by `_type` to its corresponding section builder.
 * Each section builder encapsulates its own validation rules and returns null
 * if required content is missing or empty.
 */
export function SectionBuilder({ sections }: ISectionBuilderProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section, index) => {
        if (!section || !section._type) {
          return null;
        }

        const key = section._id || `section-${index}`;

        switch (section._type) {
          case "personalIntroSection":
            return <PersonalIntroSectionBuilder key={key} data={section} />;
          case "engineeringPillars":
            return (
              <EngineeringPillarsSectionBuilder key={key} data={section} />
            );
          case "quoteSection":
            return <QuoteSectionBuilder key={key} data={section} />;
          case "technicalFoundation":
            return (
              <TechnicalFoundationSectionBuilder key={key} data={section} />
            );
          case "philosophySection":
            return <PhilosophySectionBuilder key={key} data={section} />;
          case "experienceSection":
            return <ExperienceSectionBuilder key={key} data={section} />;
          case "ctaSection":
            return <CtaSectionBuilder key={key} data={section} />;
          default:
            return null;
        }
      })}
    </>
  );
}

export default SectionBuilder;

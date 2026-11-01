import { AboutBuilderSectionBuilder } from "@/sections/about-builder/builder";
import { CtaSectionBuilder } from "@/sections/cta/builder";
import {
  PersonalIntroSectionBuilder,
  hasPersonalIntroContent,
} from "@/sections/personal-intro/builder";
import { ExperienceSectionBuilder } from "@/sections/experience/builder";
import { ProcessSectionBuilder } from "@/sections/process/builder";
import { QuoteSectionBuilder } from "@/sections/quote/builder";
import { assignSectionNumbers } from "./numbering";
import type {
  ISanitySectionBlock,
  ISectionBuilderProps,
} from "./interface";

/**
 * Mirrors each section builder's own early-return condition so skipped blocks
 * do not consume a section number.
 */
function shouldRenderSection(section: ISanitySectionBlock): boolean {
  switch (section._type) {
    case "personalIntroSection":
      return (
        Boolean(section.heading?.trim()) &&
        hasPersonalIntroContent(section)
      );
    case "aboutBuilderSection":
    case "processSection":
    case "experienceSection":
    case "ctaSection":
      return Boolean(section.heading?.trim());
    case "quoteSection":
      return Boolean(section.quote?.trim());
    default:
      return false;
  }
}

/**
 * Independent SectionBuilder for dynamic CMS `pageSections` blocks.
 *
 * Dispatches each buildable section block by `_type` to its corresponding
 * section builder while keeping standalone main sections (`about`,
 * `technology`, `projects`, `contact`) completely separate.
 *
 * Section numbers are computed here when numbered=true: the hero is 01 and
 * rendered sections are numbered from 02 in the order given; a skipped section
 * consumes no number. When numbered=false (e.g. on About page), no section
 * receives a number.
 */
export function SectionBuilder({
  sections,
  numbered = true,
}: ISectionBuilderProps) {
  if (!sections || sections.length === 0) return null;

  const renders = sections.map((section) => shouldRenderSection(section));
  const numbers = numbered
    ? assignSectionNumbers(renders)
    : renders.map(() => null);

  return (
    <>
      {sections.map((section, index) => {
        if (!renders[index]) return null;
        const sectionNumber = numbers[index];

        switch (section._type) {
          case "personalIntroSection":
            return (
              <PersonalIntroSectionBuilder
                key={section._id}
                data={section}
              />
            );
          case "aboutBuilderSection":
            return (
              <AboutBuilderSectionBuilder
                key={section._id}
                data={section}
                sectionNumber={sectionNumber}
              />
            );
          case "quoteSection":
            return (
              <QuoteSectionBuilder
                key={section._id}
                data={section}
              />
            );
          case "processSection":
            return (
              <ProcessSectionBuilder
                key={section._id}
                data={section}
              />
            );
          case "experienceSection":
            return (
              <ExperienceSectionBuilder
                key={section._id}
                data={section}
              />
            );
          case "ctaSection":
            return (
              <CtaSectionBuilder
                key={section._id}
                data={section}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}

export default SectionBuilder;

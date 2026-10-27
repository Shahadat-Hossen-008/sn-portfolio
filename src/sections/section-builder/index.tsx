import { AboutBuilderSectionBuilder } from "@/sections/about-builder/builder";
import { CtaSectionBuilder } from "@/sections/cta/builder";
import { CuriositySectionBuilder } from "@/sections/curiosity/builder";
import { ExperienceSectionBuilder } from "@/sections/experience/builder";
import { ProcessSectionBuilder } from "@/sections/process/builder";
import { QuoteSectionBuilder } from "@/sections/quote/builder";
import { assignSectionNumbers } from "@/sanity/lib/aboutBuilder";
import { getCuriosityTiles } from "@/sanity/lib/curiosity";
import type { LatestProjects } from "@/sanity/lib/curiosity";
import type {
  ISanitySectionBlock,
  ISectionBuilderProps,
} from "./interface";

/** Mirrors each section builder's own "render nothing" rule. */
function willRender(
  section: ISanitySectionBlock,
  latestProjects: LatestProjects,
): boolean {
  switch (section._type) {
    case "curiositySection":
      return (
        Boolean(section.heading?.trim()) &&
        Object.values(getCuriosityTiles(section, latestProjects)).some(Boolean)
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
  latestProjects = [],
  numbered = true,
}: ISectionBuilderProps) {
  if (!sections || sections.length === 0) return null;

  const renders = sections.map((section) => willRender(section, latestProjects));
  const numbers = numbered
    ? assignSectionNumbers(renders)
    : renders.map(() => null);

  return (
    <>
      {sections.map((section, index) => {
        if (!renders[index]) return null;
        const sectionNumber = numbers[index];

        switch (section._type) {
          case "curiositySection":
            return (
              <CuriositySectionBuilder
                key={section._id}
                data={section}
                latestProjects={latestProjects}
                sectionNumber={sectionNumber}
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

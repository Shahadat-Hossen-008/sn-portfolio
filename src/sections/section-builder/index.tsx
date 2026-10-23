import { AboutBuilderSectionBuilder } from "@/sections/about-builder/builder";
import { CuriositySectionBuilder } from "@/sections/curiosity/builder";
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
      return Boolean(section.heading?.trim());
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
 * Section numbers are computed here: the hero is 01 and rendered sections are
 * numbered from 02 in the order given; a skipped section consumes no number.
 */
export function SectionBuilder({
  sections,
  latestProjects = [],
}: ISectionBuilderProps) {
  if (!sections || sections.length === 0) return null;

  const numbers = assignSectionNumbers(sections.map((section) => willRender(section, latestProjects)));

  return (
    <>
      {sections.map((section, index) => {
        const sectionNumber = numbers[index];
        if (sectionNumber === null) return null;

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
          default:
            return null;
        }
      })}
    </>
  );
}

export default SectionBuilder;

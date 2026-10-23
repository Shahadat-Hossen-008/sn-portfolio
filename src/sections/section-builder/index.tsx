import { CuriositySectionBuilder } from "@/sections/curiosity/builder";
import type { ISectionBuilderProps } from "./interface";

/**
 * Independent SectionBuilder for dynamic CMS `pageSections` blocks.
 *
 * Dispatches each buildable section block by `_type` to its corresponding
 * section builder while keeping standalone main sections (`about`,
 * `technology`, `projects`, `contact`) completely separate.
 */
export function SectionBuilder({ sections }: ISectionBuilderProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section, index) => {
        switch (section._type) {
          case "curiositySection": {
            if (!section.data?.heading?.trim()) return null;
            return (
              <CuriositySectionBuilder
                key={section._key ?? `${section._type}-${index}`}
                data={section.data}
                latestProjects={section.latestProjects}
                sectionNumber={section.sectionNumber}
              />
            );
          }
          default:
            return null;
        }
      })}
    </>
  );
}

export default SectionBuilder;

import { ProjectsSection } from "@/sections/projects";
import { SectionBuilder } from "@/sections/section-builder";
import type { IProjectPageBuilderProps } from "./interface";

export function ProjectPageBuilder({ page }: IProjectPageBuilderProps) {
  return (
    <main className="pt-8 pb-28">
      {page.projects && page.projects.length > 0 && (
        <ProjectsSection
          eyebrow={page.eyebrow}
          heading={page.heading}
          headingAccent={page.headingAccent}
          projects={page.projects}
        />
      )}
      {page.sections && <SectionBuilder sections={page.sections} />}
    </main>
  );
}

export default ProjectPageBuilder;

import { PageIntroSectionBuilder } from "@/sections/page-intro/builder";
import { ProjectsSectionBuilder } from "@/sections/projects/builder";
import { SectionBuilder } from "@/sections/section-builder";
import type { IProjectPageBuilderProps } from "./interface";

export function ProjectPageBuilder({ page }: IProjectPageBuilderProps) {
  return (
    <main className="pt-8 pb-28">
      {page.pageIntro && <PageIntroSectionBuilder data={page.pageIntro} />}
      {page.projects && <ProjectsSectionBuilder projects={page.projects} />}
      {page.sections && <SectionBuilder sections={page.sections} numbered={false} />}
    </main>
  );
}

export default ProjectPageBuilder;

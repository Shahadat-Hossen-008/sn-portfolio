import { PageIntroSectionBuilder } from "@/sections/page-intro/builder";
import { ProjectsSectionBuilder } from "@/sections/projects/builder";
import { SectionBuilder } from "@/sections/section-builder";
import type { PROJECT_PAGE_QUERYResult } from "@/sanity/types";

type ProjectPage = NonNullable<PROJECT_PAGE_QUERYResult>;

export function ProjectPageBuilder({ page }: { page: ProjectPage }) {
  return (
    <main className="pt-8 pb-28">
      {page.pageIntro && <PageIntroSectionBuilder data={page.pageIntro} />}
      {page.projects && <ProjectsSectionBuilder projects={page.projects} />}
      {page.sections && <SectionBuilder sections={page.sections} numbered={false} />}
    </main>
  );
}

export default ProjectPageBuilder;
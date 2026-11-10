import type { PROJECT_PAGE_QUERYResult } from "@/sanity/types";

export type ProjectPage = NonNullable<PROJECT_PAGE_QUERYResult>;
export type SanityProjectItems = ProjectPage["projects"];

export interface IProjectPageBuilderProps {
  page: ProjectPage;
}

import type { PROJECT_QUERYResult } from "@/sanity/types";

export type ProjectItem = NonNullable<PROJECT_QUERYResult[number]>;

export interface IResolvedProjectItem extends ProjectItem {
  projectHref: string | null;
}

export interface IProjectsSectionProps {
  projects: IResolvedProjectItem[];
}

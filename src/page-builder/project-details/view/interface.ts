import type { SINGLE_PROJECT_QUERYResult } from "@/sanity/types";

export type ProjectDetailsData = NonNullable<SINGLE_PROJECT_QUERYResult>;

export interface IProjectDetailsProps {
  project: ProjectDetailsData;
}

export { getProject } from "./data/loader";
export { generateProjectDetailsMetadata } from "./metadata";
export { ProjectDetailsView } from "./view";
export type { IProjectDetailsProps, ProjectDetailsData } from "./view/interface";

export interface IProjectPageParams {
  params: Promise<{ slug: string }>;
}

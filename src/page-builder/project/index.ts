export { ProjectPageBuilder, default as ProjectPage } from "./view";
export type {
  IProjectPageBuilderProps,
  ProjectPage as ProjectPageType,
  SanityProjectItems,
} from "./view/interface";
export { getProjectPage } from "./data/loader";
export { PROJECT_SECTION_FRAGMENT } from "./data/fragment";
export { PROJECT_PAGE_QUERY } from "./data/query";
export { generateProjectMetadata } from "./metadata";

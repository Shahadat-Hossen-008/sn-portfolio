import type { PROJECT_PAGE_QUERYResult } from "@/sanity/types";

export type ProjectItem = NonNullable<
  NonNullable<PROJECT_PAGE_QUERYResult>["projects"]
>[number];

export interface IProjectsSectionProps {
  eyebrow?: string | null;
  heading?: string | null;
  headingAccent?: string | null;
  projects: ProjectItem[];
}

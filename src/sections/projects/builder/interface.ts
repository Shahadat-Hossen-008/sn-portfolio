import type { PROJECT_PAGE_QUERYResult } from "@/sanity/types";

export type SanityProjectItems = NonNullable<PROJECT_PAGE_QUERYResult>["projects"];

export interface ISanityProjectsSectionProps {
  projects: SanityProjectItems;
}

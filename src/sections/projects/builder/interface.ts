import type { PROJECT_PAGE_QUERYResult } from "@/sanity/types";

export type SanityProjectItems = NonNullable<PROJECT_PAGE_QUERYResult>["projects"];

export interface ISanityProjectsSectionProps {
  eyebrow?: string | null;
  heading?: string | null;
  headingAccent?: string | null;
  projects: SanityProjectItems;
}

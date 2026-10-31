import type { LatestProjects } from "@/sections/curiosity/helpers";
import type { PageSection } from "@/page-builder/shared/page-section";

/** The generated, discriminated block type; no hand-copied shapes. */
export type ISanitySectionBlock = PageSection;

export interface ISectionBuilderProps {
  /** `profile.sections`: the editor's ordered page sections. */
  sections?: ISanitySectionBlock[] | null;
  /** Fallback rows for the curiosity "work" tile. */
  latestProjects?: LatestProjects;
  /** When false, no section receives a section number. Defaults to true. */
  numbered?: boolean;
}

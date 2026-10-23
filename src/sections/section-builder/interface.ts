import type { LatestProjects } from "@/sanity/lib/curiosity";
import type { ProfileSection } from "@/sanity/lib/sections";

/** The generated, discriminated block type; no hand-copied shapes. */
export type ISanitySectionBlock = ProfileSection;

export interface ISectionBuilderProps {
  /** `profile.sections`: the editor's ordered page sections. */
  sections?: ISanitySectionBlock[] | null;
  /** Fallback rows for the curiosity "work" tile. */
  latestProjects?: LatestProjects;
}

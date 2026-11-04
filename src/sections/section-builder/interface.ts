import type { PageSection } from "@/page-builder/shared/page-section";

/** The generated, discriminated block type; no hand-copied shapes. */
export type ISanitySectionBlock = PageSection;

export interface ISectionBuilderProps {
  /** `profile.sections`: the editor's ordered page sections. */
  sections?: Array<ISanitySectionBlock | null> | null;
}

import type { PageSection } from "@/page-builder/shared/page-section";

export type ProcessSectionData = Extract<
  PageSection,
  { _type: "processSection" }
>;

export type NonNullableProcessSection = NonNullable<ProcessSectionData>;

export interface ISanityProcessProps {
  data: NonNullableProcessSection;
}

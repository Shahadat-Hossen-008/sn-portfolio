import type { PageSection } from "@/page-builder/shared/page-section";

export type TechnicalFoundationData = Extract<
  PageSection,
  { _type: "technicalFoundation" | "processSection" }
>;

export type NonNullableTechnicalFoundation = NonNullable<TechnicalFoundationData>;

export interface ISanityTechnicalFoundationProps {
  data: NonNullableTechnicalFoundation;
}

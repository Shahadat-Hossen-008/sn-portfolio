import type { PageSection } from "@/page-builder/shared/page-section";

export type CtaSectionData = Extract<
  PageSection,
  { _type: "ctaSection" }
>;

export type NonNullableCtaSection = NonNullable<CtaSectionData>;

export interface ISanityCtaProps {
  data: NonNullableCtaSection;
}

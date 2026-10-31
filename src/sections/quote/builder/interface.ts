import type { PageSection } from "@/page-builder/shared/page-section";

export type QuoteSectionData = Extract<
  PageSection,
  { _type: "quoteSection" }
>;

export type NonNullableQuoteSection = NonNullable<QuoteSectionData>;

export interface ISanityQuoteProps {
  data: NonNullableQuoteSection;
}

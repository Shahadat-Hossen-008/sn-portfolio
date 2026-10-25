import type { ProfileSection } from "@/sanity/lib/sections";

export type QuoteSectionData = Extract<
  ProfileSection,
  { _type: "quoteSection" }
>;

export type NonNullableQuoteSection = NonNullable<QuoteSectionData>;

export interface ISanityQuoteProps {
  data: NonNullableQuoteSection;
}

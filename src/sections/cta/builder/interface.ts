import type { ProfileSection } from "@/sanity/lib/sections";

export type CtaSectionData = Extract<
  ProfileSection,
  { _type: "ctaSection" }
>;

export type NonNullableCtaSection = NonNullable<CtaSectionData>;

export interface ISanityCtaProps {
  data: NonNullableCtaSection;
}

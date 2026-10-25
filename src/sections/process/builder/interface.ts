import type { ProfileSection } from "@/sanity/lib/sections";

export type ProcessSectionData = Extract<
  ProfileSection,
  { _type: "processSection" }
>;

export type NonNullableProcessSection = NonNullable<ProcessSectionData>;

export interface ISanityProcessProps {
  data: NonNullableProcessSection;
}

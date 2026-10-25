import type { ProfileSection } from "@/sanity/lib/sections";

export type ExperienceSectionData = Extract<
  ProfileSection,
  { _type: "experienceSection" }
>;

export type NonNullableExperienceSection = NonNullable<ExperienceSectionData>;

export interface ISanityExperienceProps {
  data: NonNullableExperienceSection;
}

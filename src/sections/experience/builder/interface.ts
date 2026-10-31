import type { PageSection } from "@/page-builder/shared/page-section";

export type ExperienceSectionData = Extract<
  PageSection,
  { _type: "experienceSection" }
>;

export type NonNullableExperienceSection = NonNullable<ExperienceSectionData>;

export interface ISanityExperienceProps {
  data: NonNullableExperienceSection;
}

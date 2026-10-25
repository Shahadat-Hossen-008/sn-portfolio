import type { ProfileSection } from "@/sanity/lib/sections";

export type AboutIntroSectionData = Extract<
  ProfileSection,
  { _type: "aboutIntroSection" }
>;

export type NonNullableAboutIntroSection = NonNullable<AboutIntroSectionData>;

export interface ISanityAboutIntroProps {
  data: NonNullableAboutIntroSection;
}

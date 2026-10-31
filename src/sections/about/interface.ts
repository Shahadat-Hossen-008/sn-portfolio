import type { ABOUT_QUERYResult } from "@/sanity/types";

type NonNullableAbout = NonNullable<ABOUT_QUERYResult>;

export interface IAboutSectionProps {
  description: NonNullableAbout["description"];
  technologies: NonNullableAbout["technologies"];
}

import type { PageSection } from "@/page-builder/shared/page-section";

export type PersonalIntroData = Extract<
  PageSection,
  { _type: "personalIntroSection" }
>;

export interface ICapability {
  _key: string;
  title: string;
  description: string | null;
}

export interface IPersonalIntroFeaturedProject {
  _id: string;
  title: string;
  year: string | null;
  summary: string | null;
  image: NonNullable<NonNullable<PersonalIntroData>["work"]>["image"] | null;
  href: string;
  openInNewTab: boolean;
}

export interface IPersonalIntroTiles {
  personalIntro: boolean;
  work: boolean;
  learning: boolean;
  beyondCode: boolean;
  availability: boolean;
}

export interface IPersonalIntroSectionProps {
  data: PersonalIntroData;
  tiles: IPersonalIntroTiles;
  capabilities: ICapability[];
  featuredProject: IPersonalIntroFeaturedProject | null;
}

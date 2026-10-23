import type {
  CuriosityData,
  LatestProjects,
} from "@/sanity/lib/curiosity";

export interface ISanityCuriosityBlock {
  _type: "curiositySection";
  _key?: string;
  data: CuriosityData;
  latestProjects: LatestProjects;
  sectionNumber?: number;
}

export type ISanitySectionBlock = ISanityCuriosityBlock;

export interface ISectionBuilderProps {
  sections?: ISanitySectionBlock[];
}

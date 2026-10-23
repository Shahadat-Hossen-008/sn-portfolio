import type {
  CuriosityData,
  CuriosityProject,
  LatestProject,
  LatestProjects,
  NonNullableCuriosity,
} from "@/sanity/lib/curiosity";

export type {
  CuriosityData,
  CuriosityProject,
  LatestProject,
  LatestProjects,
  NonNullableCuriosity,
};

export interface ISanityCuriositySectionProps {
  data: CuriosityData;
  latestProjects: LatestProjects;
  sectionNumber?: number;
}

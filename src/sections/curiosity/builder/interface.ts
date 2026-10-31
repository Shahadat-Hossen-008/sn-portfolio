import type {
  CuriosityData,
  CuriosityProject,
  LatestProject,
  LatestProjects,
  NonNullableCuriosity,
} from "@/sections/curiosity/helpers";

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
  sectionNumber?: number | null;
}

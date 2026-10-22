import type {
  LATEST_PROJECTS_QUERYResult,
  PROFILE_QUERYResult,
} from "@/sanity/types";

export type CuriosityData = NonNullable<PROFILE_QUERYResult>["curiosity"];
export type NonNullableCuriosity = NonNullable<CuriosityData>;
export type LatestProjects = LATEST_PROJECTS_QUERYResult;
export type LatestProject = LATEST_PROJECTS_QUERYResult[number];
export type CuriosityProject = NonNullable<
  NonNullable<NonNullableCuriosity["work"]>["projects"]
>[number];

export type CuriosityGridProps = {
  data: CuriosityData;
  latestProjects: LatestProjects;
  sectionNumber?: number;
};

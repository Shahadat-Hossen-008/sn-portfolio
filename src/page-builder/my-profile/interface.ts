import type {
  LATEST_PROJECTS_QUERYResult,
  PROFILE_QUERYResult,
} from "@/sanity/types";

/** Content needed to compose the public home page. */
export interface IMyProfilePageData {
  profile: PROFILE_QUERYResult;
  latestProjects: LATEST_PROJECTS_QUERYResult;
}

export interface IMyProfilePageBuilderProps {
  data: IMyProfilePageData;
}

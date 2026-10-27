import type {
  ABOUT_QUERYResult,
  LATEST_PROJECTS_QUERYResult,
  PROFILE_QUERYResult,
  PROJECT_QUERYResult,
  TECH_QUERYResult,
} from "@/sanity/types";

/** Content needed to compose the public home page. */
export interface IMyProfilePageData {
  profile: PROFILE_QUERYResult;
  projects: PROJECT_QUERYResult;
  about: ABOUT_QUERYResult;
  tech: TECH_QUERYResult;
  latestProjects: LATEST_PROJECTS_QUERYResult;
}

export interface IMyProfilePageBuilderProps {
  data: IMyProfilePageData;
}

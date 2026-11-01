import type { PROFILE_QUERYResult } from "@/sanity/types";

/** Content needed to compose the public home page. */
export interface IMyProfilePageData {
  profile: PROFILE_QUERYResult;
}

export interface IMyProfilePageBuilderProps {
  data: IMyProfilePageData;
}

import type { PROFILE_QUERYResult } from "@/sanity/types";

/** Content needed to compose the public home page. */
export interface IMyProfilePageData {
  profile: PROFILE_QUERYResult;
}

export interface IMyProfilePageBuilderProps {
  profile?: PROFILE_QUERYResult;
  /** Backward compatibility when passed as { data: { profile } } */
  data?: IMyProfilePageData;
}

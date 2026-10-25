import type { PROFILE_QUERYResult } from "@/sanity/types";

/** One dereferenced block of `myProfilePage.pageSections`, discriminated by `_type`. */
export type ProfileSection = NonNullable<
  NonNullable<PROFILE_QUERYResult>["sections"]
>[number];

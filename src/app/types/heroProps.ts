import type { PROFILE_QUERYResult } from "@/sanity/types";

/**
 * `PROFILE_QUERY` is a singleton lookup, so its result can be `null` and `hero`
 * is optional on the document. These aliases unwrap those two levels without
 * hand-copying field shapes from the generated types.
 */
type ProfileResult = NonNullable<PROFILE_QUERYResult>;

export type HeroData = NonNullable<ProfileResult["hero"]>;

export type HeroProps = {
  hero: HeroData;
  /** Top-level author name. The query's `headline` key is the author role. */
  fullName: ProfileResult["fullName"];
};

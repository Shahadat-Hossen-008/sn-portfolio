import type { HeroData, ProfileResult } from "../../interface";

export interface ISanityPrimaryHeroProps {
  hero: HeroData;
  /** Top-level author name. The query's `headline` key is the author role. */
  fullName: ProfileResult["fullName"];
}

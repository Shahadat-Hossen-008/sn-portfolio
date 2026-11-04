import type { ABOUT_PAGE_QUERYResult } from "@/sanity/types";

/** The shape returned by the About page query for the aboutIntro field. */
export type AboutIntroData = NonNullable<ABOUT_PAGE_QUERYResult>["aboutIntro"];

export interface ISanityAboutIntroProps {
  data: AboutIntroData;
}

import type { ABOUT_PAGE_QUERYResult } from "@/sanity/types";

/** The `pageIntro` inline object projected by the about page query. */
export type PageIntroData = NonNullable<ABOUT_PAGE_QUERYResult>["pageIntro"];

export interface ISanityPageIntroProps {
  data: PageIntroData;
}
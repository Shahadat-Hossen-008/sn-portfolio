import type { ABOUT_PAGE_QUERYResult } from "@/sanity/types";

export type AboutPage = NonNullable<ABOUT_PAGE_QUERYResult>;

export interface IAboutPageBuilderProps {
  page: AboutPage;
}

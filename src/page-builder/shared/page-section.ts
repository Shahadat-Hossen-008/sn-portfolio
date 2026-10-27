import type { ABOUT_PAGE_QUERYResult } from "@/sanity/types";

/** One dereferenced block from the shared page-section projection. */
export type PageSection = NonNullable<
  NonNullable<ABOUT_PAGE_QUERYResult>["sections"]
>[number];

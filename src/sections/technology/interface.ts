import type { TECH_QUERYResult } from "@/sanity/types";

export type TechnologyItem = TECH_QUERYResult[number];

export interface ITechnologySectionProps {
  technology: TechnologyItem[];
}

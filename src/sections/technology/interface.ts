import type { TechTag } from "@/sanity/types";

export type TechnologyItem = Pick<TechTag, "_id" | "label" | "iconImage">;

export interface ITechnologySectionProps {
  technology: TechnologyItem[];
}

import type { PersonalIntroData } from "../../interface";

export type Learning = NonNullable<PersonalIntroData>["learning"];

export interface ILearningTileProps {
  learning: Learning;
  rise?: number;
  layout?: "designed" | "fallback";
}

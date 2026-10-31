import type { NonNullableCuriosity } from "@/sections/curiosity/helpers";

export type Learning = NonNullableCuriosity["learning"];

export interface ILearningTileProps {
  learning: Learning;
  rise: number;
  layout: "designed" | "fallback";
}

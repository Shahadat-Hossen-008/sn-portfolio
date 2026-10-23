import type { NonNullableCuriosity } from "@/sanity/lib/curiosity";

export type Learning = NonNullableCuriosity["learning"];

export interface ILearningTileProps {
  learning: Learning;
  rise: number;
  layout: "designed" | "fallback";
}

import type { NonNullableCuriosity } from "@/sanity/lib/curiosity";

export type Interests = NonNullableCuriosity["interests"];

export interface IInterestsTileProps {
  interests: Interests;
  rise: number;
  layout: "designed" | "fallback";
}

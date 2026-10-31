import type { NonNullableCuriosity } from "@/sections/curiosity/helpers";

export type Interests = NonNullableCuriosity["interests"];

export interface IInterestsTileProps {
  interests: Interests;
  rise: number;
  layout: "designed" | "fallback";
}

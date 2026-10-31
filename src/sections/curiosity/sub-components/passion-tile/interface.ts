import type { NonNullableCuriosity } from "@/sections/curiosity/helpers";

export type Passion = NonNullableCuriosity["passion"];

export interface IPassionTileProps {
  passion: Passion;
  rise: number;
  layout: "designed" | "fallback";
}

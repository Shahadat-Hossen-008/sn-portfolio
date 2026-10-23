import type { NonNullableCuriosity } from "@/sanity/lib/curiosity";

export type Passion = NonNullableCuriosity["passion"];

export interface IPassionTileProps {
  passion: Passion;
  rise: number;
  layout: "designed" | "fallback";
}

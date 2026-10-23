import type { NonNullableCuriosity } from "@/sanity/lib/curiosity";

export type Stack = NonNullableCuriosity["stack"];

export interface IStackTileProps {
  stack: Stack;
  rise: number;
  layout: "designed" | "fallback";
}

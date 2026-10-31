import type { NonNullableCuriosity } from "@/sections/curiosity/helpers";

export type Stack = NonNullableCuriosity["stack"];

export interface IStackTileProps {
  stack: Stack;
  rise: number;
  layout: "designed" | "fallback";
}

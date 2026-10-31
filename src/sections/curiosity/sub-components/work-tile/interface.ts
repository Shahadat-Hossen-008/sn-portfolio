import type {
  CuriosityProjectRow,
  NonNullableCuriosity,
} from "@/sections/curiosity/helpers";

export type Work = NonNullableCuriosity["work"];

export interface IWorkTileProps {
  work: Work;
  projects: CuriosityProjectRow[];
  rise: number;
  layout: "designed" | "fallback";
}

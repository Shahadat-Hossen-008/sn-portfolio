import type {
  CuriosityProjectRow,
  NonNullableCuriosity,
} from "@/sanity/lib/curiosity";

export type Work = NonNullableCuriosity["work"];

export interface IWorkTileProps {
  work: Work;
  projects: CuriosityProjectRow[];
  rise: number;
  layout: "designed" | "fallback";
}

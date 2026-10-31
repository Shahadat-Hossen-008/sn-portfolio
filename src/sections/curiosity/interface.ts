import type {
  CuriosityData,
  CuriosityProjectRow,
  CuriosityTileAvailability,
} from "@/sections/curiosity/helpers";

export interface ICuriositySectionProps {
  data: CuriosityData;
  eyebrowText: string | null;
  headingParts: string[];
  intro?: string;
  tiles: CuriosityTileAvailability;
  layout: "designed" | "fallback";
  projects: CuriosityProjectRow[];
}

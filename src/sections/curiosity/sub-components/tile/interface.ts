import type { ReactNode } from "react";

export type TileTone = "flat" | "forest" | "glow" | "cta" | "light";

export interface ITileProps {
  children: ReactNode;
  tone: TileTone;
  labelledBy: string;
  className?: string;
  rise?: number;
}

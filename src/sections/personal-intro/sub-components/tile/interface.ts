import type { ReactNode } from "react";

export type TileTone = "flat" | "forest" | "glow" | "cta" | "light";

export interface ITileProps {
  children: ReactNode;
  /** Semantic color tone theme for the tile's background and border styling. */
  tone: TileTone;
  /** Element ID used for accessibility (`aria-labelledby`). */
  labelledBy: string;
  /** Optional additional CSS classes for custom grid placement or sizing. */
  className?: string;
  /** Stagger index (0-5) controlling the scroll-driven entrance animation timing. */
  rise?: number;
}

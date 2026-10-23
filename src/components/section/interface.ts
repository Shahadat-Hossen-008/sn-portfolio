import type { ElementType, HTMLAttributes, ReactNode } from "react";

export type ISectionProps<T extends ElementType = "section"> = {
  as?: T;
  tone?: "light" | "forest";
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "color">;

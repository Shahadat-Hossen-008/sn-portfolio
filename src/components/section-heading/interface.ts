import type { ElementType } from "react";

export interface ISectionHeadingProps {
  as?: ElementType;
  id?: string;
  eyebrow?: string | null;
  heading: string;
  headingAccent?: string | null;
  className?: string;
  eyebrowClassName?: string;
  headingClassName?: string;
}

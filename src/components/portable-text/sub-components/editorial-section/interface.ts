import type { PortableTextBlock } from "next-sanity";

export interface IEditorialSectionProps {
  layout?: "twoColumn" | "straightforward" | string | null;
  label?: string | null;
  autoNumber?: boolean | null;
  stepNumber?: number | null;
  heading?: string | null;
  body?: PortableTextBlock[] | null;
}

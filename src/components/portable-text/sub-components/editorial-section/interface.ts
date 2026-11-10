import type { PortableTextBlock } from "next-sanity";

export interface IEditorialSectionProps {
  /**
   * Preserved for backward compatibility with existing Sanity documents (`twoColumn` | `straightforward`),
   * while `EditorialSectionBlock` always renders in a unified single-column editorial structure.
   */
  layout?: "straightforward" | string | null;
  label?: string | null;
  autoNumber?: boolean | null;
  stepNumber?: number | null;
  heading?: string | null;
  body?: PortableTextBlock[] | null;
}

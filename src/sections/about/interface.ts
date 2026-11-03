import type { PortableTextBlock } from "next-sanity";

export interface IAboutSectionProps {
  description?: PortableTextBlock[] | null;
  technologies?: Array<{ label?: string | null }> | null;
}

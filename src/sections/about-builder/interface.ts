import type { AboutFact, AboutNote } from "@/sanity/lib/aboutBuilder";

export interface IAboutBuilderCta {
  href: string;
  label: string;
  openInNewTab: boolean;
}

export interface IAboutBuilderProps {
  /** "03 — About the builder", or null when there is no eyebrow. */
  label: string | null;
  headingParts: string[];
  intro?: string;
  notes: AboutNote[];
  facts: AboutFact[];
  cta: IAboutBuilderCta | null;
}

import type { CustomImage } from "@/sanity/types";

export interface IHeroCta {
  href: string;
  label: string;
  external: boolean;
}

export interface IHeroFact {
  label: string;
  value: string;
}

export interface IHeroProps {
  statusLabel: string;
  location: string;
  subline: string;
  parts: string[];
  primaryCta: IHeroCta | null;
  secondaryCta: IHeroCta | null;
  hasActions: boolean;
  showEyebrow: boolean;
  showPanel: boolean;
  nowBuildingTitle: string;
  progress: number | null;
  facts: IHeroFact[];
  portraitImage: CustomImage["imageFile"] | null;
  portraitAlt?: string;
  initials: string;
}

export interface ICtaButton {
  href: string;
  label: string;
  openInNewTab: boolean;
}

export interface ICtaSectionProps {
  eyebrow?: string;
  heading: string;
  headingAccent?: string | null;
  intro?: string;
  cta: ICtaButton | null;
}

import type { CleanTool } from "@/sanity/lib/aboutSections";

export interface IProcessStep {
  _key: string;
  label: string;
  heading: string;
  tools: CleanTool[];
}

export interface IProcessProps {
  eyebrow?: string;
  heading: string;
  headingAccent?: string | null;
  intro?: string;
  steps: IProcessStep[];
}

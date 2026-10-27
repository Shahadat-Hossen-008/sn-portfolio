import type { CleanTool } from "@/sections/shared/section-formatting";

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

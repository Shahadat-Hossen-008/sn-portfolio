import type { CleanTool } from "@/sanity/lib/aboutSections";

export interface IExperienceRole {
  _key: string;
  role: string;
  company: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean | null;
  outcome?: string;
  tools: CleanTool[];
}

export interface IExperienceProps {
  eyebrow?: string;
  heading: string;
  headingAccent?: string | null;
  intro?: string;
  roles: IExperienceRole[];
}

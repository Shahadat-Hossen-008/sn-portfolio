import type { CleanTool } from "@/sections/shared/section-formatting";

export interface IExperienceProject {
  _id: string;
  title?: string | null;
  slug?: string | null;
}

export interface IExperienceRole {
  _key: string;
  role: string;
  company: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean | null;
  description?: string;
  contribution?: string;
  impact?: string;
  featured?: boolean;
  outcome?: string;
  project?: IExperienceProject | null;
  tools: CleanTool[];
}

export interface IExperienceProps {
  eyebrow?: string;
  intro?: string;
  roles: IExperienceRole[];
}

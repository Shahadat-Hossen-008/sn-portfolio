import { cleanTools } from "@/sanity/lib/aboutSections";
import { ExperienceSection } from "../index";
import type { IExperienceProps, IExperienceRole } from "../interface";
import type { ISanityExperienceProps } from "./interface";

export function ExperienceSectionBuilder({ data }: ISanityExperienceProps) {
  const heading = data?.heading?.trim();
  if (!heading) return null;

  const rawRoles = data.roles ?? [];
  const roles: IExperienceRole[] = rawRoles
    .filter((role): role is NonNullable<typeof role> =>
      Boolean(role && role.role?.trim() && role.company?.trim()),
    )
    .slice(0, 5)
    .map((role) => ({
      _key: role._key,
      role: role.role.trim(),
      company: role.company.trim(),
      startDate: role.startDate,
      endDate: role.endDate,
      current: role.current,
      outcome: role.outcome?.trim() || undefined,
      tools: cleanTools(role.tools),
    }));

  const props: IExperienceProps = {
    eyebrow: data.eyebrow?.trim() || undefined,
    heading,
    headingAccent: data.headingAccent,
    intro: data.intro?.trim() || undefined,
    roles,
  };

  return <ExperienceSection {...props} />;
}

export default ExperienceSectionBuilder;

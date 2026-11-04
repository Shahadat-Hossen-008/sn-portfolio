import { cleanTools } from "@/sections/shared/section-formatting";
import { ExperienceSection } from "../index";
import type { IExperienceProps, IExperienceRole } from "../interface";
import type { ISanityExperienceProps } from "./interface";

export function ExperienceSectionBuilder({ data }: ISanityExperienceProps) {
  const rawRoles = data?.roles ?? [];
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
      description: role.description?.trim() || undefined,
      contribution: role.contribution?.trim() || undefined,
      impact: role.impact?.trim() || undefined,
      featured: Boolean(role.featured),
      outcome: role.outcome?.trim() || undefined,
      project:
        role.project?._id && role.project?.slug
          ? {
              _id: role.project._id,
              title: role.project.title ?? null,
              slug: role.project.slug,
            }
          : null,
      tools: cleanTools(role.tools),
    }));

  if (roles.length === 0) return null;

  const props: IExperienceProps = {
    eyebrow: data.eyebrow?.trim() || "EXPERIENCE",
    intro: data.intro?.trim() || undefined,
    roles,
  };

  return <ExperienceSection {...props} />;
}

export default ExperienceSectionBuilder;

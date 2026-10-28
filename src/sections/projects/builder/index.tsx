import { resolveLink } from "@/lib/sanity/links";
import type { SanityLink } from "@/lib/sanity/links";
import { ProjectsSection } from "../index";
import type { IResolvedProjectItem } from "../interface";
import type { ISanityProjectsSectionProps } from "./interface";

/**
 * `projectDescription` used to be Portable Text and is now plain text. Existing
 * documents still hold blocks, so flatten them until the content is re-entered.
 */
function plainText(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (!Array.isArray(value)) return null;

  const text = value
    .map((block) => {
      const children = (block as { children?: Array<{ text?: string }> })
        .children;
      return Array.isArray(children)
        ? children.map((child) => child?.text ?? "").join("")
        : "";
    })
    .filter(Boolean)
    .join("\n\n");

  return text.trim() || null;
}

export function ProjectsSectionBuilder({
  projects,
}: ISanityProjectsSectionProps) {
  const resolvedProjects: IResolvedProjectItem[] = (projects ?? [])
    .filter(
      (project): project is NonNullable<typeof project> => project !== null,
    )
    .map((project) => ({
      ...project,
      projectDescription: plainText(project.projectDescription),
      // Prefer the live deployment; fall back to the case study. Malformed or
      // legacy values resolve to `null` and are omitted rather than rendered
      // as a broken href.
      projectHref:
        project.liveLink?.trim() ||
        resolveLink(project.caseStudy as unknown as SanityLink) ||
        null,
    }));

  return <ProjectsSection projects={resolvedProjects} />;
}

export default ProjectsSectionBuilder;

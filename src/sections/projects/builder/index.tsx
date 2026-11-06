import { toPlainText } from "@portabletext/react";
import { ProjectsSection } from "../index";
import type { ISanityProjectsSectionProps } from "./interface";

function cleanText(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (Array.isArray(value) && value.length > 0) {
    try {
      const text = toPlainText(value).trim();
      return text.length > 0 ? text : null;
    } catch {
      return null;
    }
  }
  return null;
}

export function ProjectsSectionBuilder({
  eyebrow,
  heading,
  headingAccent,
  projects,
}: ISanityProjectsSectionProps) {
  const validProjects = (projects ?? [])
    .filter(
      (project): project is NonNullable<typeof project> =>
        Boolean(project && cleanText(project.projectTitle)),
    )
    .map((project) => ({
      ...project,
      projectTitle: cleanText(project.projectTitle) || "",
      projectDescription: cleanText(project.projectDescription),
    }));

  return (
    <ProjectsSection
      eyebrow={eyebrow}
      heading={heading}
      headingAccent={headingAccent}
      projects={validProjects}
    />
  );
}

export default ProjectsSectionBuilder;

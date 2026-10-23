import { resolveLink } from "@/sanity/lib/links";
import type { SanityLink } from "@/sanity/lib/links";
import { ProjectsSection } from "../index";
import type { IResolvedProjectItem } from "../interface";
import type { ISanityProjectsSectionProps } from "./interface";

export function ProjectsSectionBuilder({
  projects,
}: ISanityProjectsSectionProps) {
  const resolvedProjects: IResolvedProjectItem[] = (projects ?? [])
    .filter(
      (project): project is NonNullable<typeof project> => project !== null,
    )
    .map((project) => ({
      ...project,
      // `projectLink` is a `link` object; legacy bare-string values
      // and malformed URLs resolve to `null` and are omitted rather
      // than rendered as a broken href.
      projectHref: resolveLink(project.projectLink as unknown as SanityLink),
    }));

  return <ProjectsSection projects={resolvedProjects} />;
}

export default ProjectsSectionBuilder;

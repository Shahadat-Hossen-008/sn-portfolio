import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ProjectDetailsView,
  generateProjectDetailsMetadata,
  getProject,
  type IProjectPageParams,
} from "@/page-builder/project-details";

export async function generateMetadata(
  props: IProjectPageParams,
): Promise<Metadata> {
  return generateProjectDetailsMetadata(props);
}

export default async function ProjectDetailsPage({
  params,
}: IProjectPageParams) {
  const { slug } = await params;
  const { data: project } = await getProject(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailsView project={project} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ProjectPageBuilder,
  generateProjectMetadata,
  getProjectPage,
} from "@/page-builder/project";

export async function generateMetadata(): Promise<Metadata> {
  return generateProjectMetadata();
}

export default async function ProjectsPage() {
  const { data: projectPage } = await getProjectPage();

  if (!projectPage) {
    notFound();
  }

  return <ProjectPageBuilder page={projectPage} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { generateProjectMetadata } from "@/page-builder/project/metadata";
import { ProjectPageBuilder } from "@/page-builder/project";
import { getProjectPage } from "@/page-builder/project/builder/get-page";

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

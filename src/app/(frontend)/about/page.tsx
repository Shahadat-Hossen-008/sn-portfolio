import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutPageBuilder } from "@/page-builder/about";
import { getAboutPage } from "@/page-builder/about/get-page";
import { generateAboutMetadata } from "@/page-builder/about/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateAboutMetadata();
}

export default async function AboutPage() {
  const { data: aboutPage } = await getAboutPage();

  if (!aboutPage) {
    notFound();
  }

  return <AboutPageBuilder page={aboutPage} />;
}

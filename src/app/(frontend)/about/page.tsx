import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  AboutPageBuilder,
  generateAboutMetadata,
  getAboutPage,
} from "@/page-builder/about";

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

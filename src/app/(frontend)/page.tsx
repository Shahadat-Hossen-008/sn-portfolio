import type { Metadata } from "next";

import {
  MyProfilePageBuilder,
  generateMyProfileMetadata,
  getHomePage,
} from "@/page-builder/my-profile";

export async function generateMetadata(): Promise<Metadata> {
  return generateMyProfileMetadata();
}

export default async function HomePage() {
  const data = await getHomePage();

  return <MyProfilePageBuilder data={data} />;
}

import type { Metadata } from "next";

import { MyProfilePageBuilder } from "@/page-builder/my-profile";
import { getHomePage } from "@/page-builder/my-profile/get-page";
import { generateMyProfileMetadata } from "@/page-builder/my-profile/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateMyProfileMetadata();
}

export default async function HomePage() {
  const data = await getHomePage();

  return <MyProfilePageBuilder data={data} />;
}

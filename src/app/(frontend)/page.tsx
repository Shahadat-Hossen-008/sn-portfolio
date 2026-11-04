import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  MyProfilePageBuilder,
  generateMyProfileMetadata,
  getProfile,
} from "@/page-builder/my-profile";

export async function generateMetadata(): Promise<Metadata> {
  return generateMyProfileMetadata();
}

export default async function HomePage() {
  const { data: profile } = await getProfile();

  if (!profile) {
    notFound();
  }

  return <MyProfilePageBuilder profile={profile} />;
}

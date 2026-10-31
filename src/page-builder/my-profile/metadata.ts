import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { buildPageMetadata } from "@/page-builder/shared/metadata";
import { getRedirectTarget } from "@/lib/metadata";
import { getProfile } from "./get-page";

export async function generateMyProfileMetadata(): Promise<Metadata> {
  const profileResult = getProfile();
  const [{ data: profile }, metadata] = await Promise.all([
    profileResult,
    buildPageMetadata({
      pageSeo: profileResult.then(({ data }) => data?.seo),
      path: "/",
    }),
  ]);

  const redirectTarget = getRedirectTarget(profile?.seo);

  if (redirectTarget) redirect(redirectTarget);

  return metadata;
}

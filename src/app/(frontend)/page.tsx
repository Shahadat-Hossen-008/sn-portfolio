import { RadialGradientBackground } from "@/components/background/RadialGradientBackground";
import Profile from "@/components/profile/Profile";
import { sanityFetch } from "@/sanity/lib/live";
import { PROFILE_QUERY } from "@/sanity/lib/queries";
import React from "react";

export default async function page() {
  const { data: profile } = await sanityFetch({ query: PROFILE_QUERY });
  console.log(profile);

  return (
    <div className="h-350">
      <RadialGradientBackground variant="hero" />
      <Profile />
    </div>
  );
}

import Navbar from "@/components/navbar/Navbar";
import About from "@/components/about/About";
import Profile from "@/components/profile/Profile";
import { sanityFetch } from "@/sanity/lib/live";
import {
  ABOUT_QUERY,
  PROFILE_QUERY,
  PROJECTS_QUERY,
} from "@/sanity/lib/queries";
import Technology from "@/components/technology/Technology";

export default async function page() {
  const { data: profile } = await sanityFetch({ query: PROFILE_QUERY });

  const { data: about } = await sanityFetch({ query: ABOUT_QUERY });

  const { data: tech } = await sanityFetch({ query: PROJECTS_QUERY });
  console.log(tech);

  return (
    <div className="bg-black ">
      {profile && <Navbar cvUrl={profile.cvUrl} />}
      <Profile profile={profile} />
      <About about={about} />
      <Technology technology={tech} />
    </div>
  );
}

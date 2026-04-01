import Navbar from "@/components/navbar/Navbar";
import About from "@/components/about/About";
import Profile from "@/components/profile/Profile";
import Project from "@/components/projects/Project";
import Technology from "@/components/technology/Technology";
import { sanityFetch } from "@/sanity/lib/live";
import {
  ABOUT_QUERY,
  PROJECT_QUERY,
  PROFILE_QUERY,
  TECH_QUERY,
} from "@/sanity/lib/queries";

export default async function page() {
  const { data: profile } = await sanityFetch({ query: PROFILE_QUERY });
  const { data: projects } = await sanityFetch({ query: PROJECT_QUERY });
  const { data: about } = await sanityFetch({ query: ABOUT_QUERY });
  const { data: tech } = await sanityFetch({ query: TECH_QUERY });

  return (
    <div className="bg-black ">
      {profile && <Navbar cvUrl={profile.cvUrl} />}
      <Profile profile={profile} />
      <About about={about} />
      <Technology technology={tech} />
      <Project projects={projects} />
    </div>
  );
}

import Navbar from "@/components/navbar/Navbar";
import Profile from "@/components/profile/Profile";
import Project from "@/components/projects/Project";
import { sanityFetch } from "@/sanity/lib/live";
import { PROFILE_QUERY, PROJECT_QUERY } from "@/sanity/lib/queries";

export default async function page() {
  const { data: profile } = await sanityFetch({ query: PROFILE_QUERY });
  const { data: projects } = await sanityFetch({ query: PROJECT_QUERY });

  return (
    <div className="bg-black ">
      {profile && <Navbar cvUrl={profile.cvUrl} />}
      <Profile profile={profile} />
      <Project projects = {projects}/>
    </div>
  );
}

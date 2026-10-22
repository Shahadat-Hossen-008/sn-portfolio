import Contact from "@/components/contact/Contact";
import About from "@/components/about/About";
import Hero from "@/components/hero/Hero";
import Profile from "@/components/profile/Profile";
import Project from "@/components/projects/Project";
import CuriosityGrid from "@/components/curiosity/CuriosityGrid";
import Technology from "@/components/technology/Technology";
import { sanityFetch } from "@/sanity/lib/live";
import { ToastContainer } from "react-toastify";
import {
  ABOUT_QUERY,
  LATEST_PROJECTS_QUERY,
  PROJECT_QUERY,
  PROFILE_QUERY,
  TECH_QUERY,
} from "@/sanity/lib/queries";

export default async function page() {
  const [
    { data: profile },
    { data: projects },
    { data: about },
    { data: tech },
    { data: latestProjects },
  ] =
    await Promise.all([
      sanityFetch({ query: PROFILE_QUERY }),
      sanityFetch({ query: PROJECT_QUERY }),
      sanityFetch({ query: ABOUT_QUERY }),
      sanityFetch({ query: TECH_QUERY }),
      sanityFetch({ query: LATEST_PROJECTS_QUERY }),
    ]);

  const hero = profile?.hero;
  // An unpublished or blank hero keeps the original profile block as fallback.
  const showHero = Boolean(hero?.headline?.trim());

  return (
    <div className="bg-background ">
      {showHero && hero ? (
        <Hero hero={hero} fullName={profile?.fullName} />
      ) : (
        <Profile profile={profile} />
      )}
      {profile?.curiosity?.heading?.trim() && (
        <CuriosityGrid
          data={profile.curiosity}
          latestProjects={latestProjects ?? []}
          sectionNumber={2}
        />
      )}
      <About about={about} />
      <Technology technology={tech} />
      <Project projects={projects} />
      <Contact />
      <ToastContainer/>
    </div>
  );
}

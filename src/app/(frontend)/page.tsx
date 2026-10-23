import { ToastContainer } from "react-toastify";

import { HeroBuilder } from "@/hero";
import { sanityFetch } from "@/sanity/lib/live";
import { AboutSectionBuilder } from "@/sections/about/builder";
import { ContactSectionBuilder } from "@/sections/contact/builder";
import { ProjectsSectionBuilder } from "@/sections/projects/builder";
import { SectionBuilder } from "@/sections/section-builder";
import { TechnologySectionBuilder } from "@/sections/technology/builder";
import {
  ABOUT_QUERY,
  LATEST_PROJECTS_QUERY,
  PROFILE_QUERY,
  PROJECT_QUERY,
  TECH_QUERY,
} from "./query";

export default async function page() {
  const [
    { data: profile },
    { data: projects },
    { data: about },
    { data: tech },
    { data: latestProjects },
  ] = await Promise.all([
    sanityFetch({ query: PROFILE_QUERY }),
    sanityFetch({ query: PROJECT_QUERY }),
    sanityFetch({ query: ABOUT_QUERY }),
    sanityFetch({ query: TECH_QUERY }),
    sanityFetch({ query: LATEST_PROJECTS_QUERY }),
  ]);

  return (
    <div className="bg-background ">
      <HeroBuilder profile={profile} />
      <SectionBuilder
        sections={
          profile?.curiosity
            ? [
                {
                  _type: "curiositySection",
                  data: profile.curiosity,
                  latestProjects: latestProjects ?? [],
                  sectionNumber: 2,
                },
              ]
            : undefined
        }
      />
      <AboutSectionBuilder about={about} />
      <TechnologySectionBuilder technology={tech} />
      <ProjectsSectionBuilder projects={projects} />
      <ContactSectionBuilder />
      <ToastContainer />
    </div>
  );
}

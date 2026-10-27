import { AboutSectionBuilder } from "@/sections/about/builder";
import { ContactSectionBuilder } from "@/sections/contact/builder";
import { HeroBuilder } from "@/sections/hero";
import { ProjectsSectionBuilder } from "@/sections/projects/builder";
import { SectionBuilder } from "@/sections/section-builder";
import { TechnologySectionBuilder } from "@/sections/technology/builder";
import type { IMyProfilePageBuilderProps } from "./interface";

export function MyProfilePageBuilder({ data }: IMyProfilePageBuilderProps) {
  const { profile, projects, about, tech, latestProjects } = data;

  return (
    <div className="bg-background">
      <HeroBuilder profile={profile} />
      <SectionBuilder
        sections={profile?.sections}
        latestProjects={latestProjects ?? []}
      />
      <AboutSectionBuilder about={about} />
      <TechnologySectionBuilder technology={tech} />
      <ProjectsSectionBuilder projects={projects} />
      <ContactSectionBuilder />
    </div>
  );
}

export default MyProfilePageBuilder;

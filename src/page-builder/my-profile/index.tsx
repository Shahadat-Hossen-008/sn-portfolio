import { HeroBuilder } from "@/sections/hero";
import { SectionBuilder } from "@/sections/section-builder";
import type { IMyProfilePageBuilderProps } from "./interface";

export function MyProfilePageBuilder({ data }: IMyProfilePageBuilderProps) {
  const { profile, latestProjects } = data;

  return (
    <div className="bg-background">
      <HeroBuilder profile={profile} />
      <SectionBuilder
        sections={profile?.sections}
        latestProjects={latestProjects ?? []}
      />
    </div>
  );
}

export default MyProfilePageBuilder;

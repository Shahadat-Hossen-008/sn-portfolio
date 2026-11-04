import { HeroBuilder } from "@/sections/hero";
import { SectionBuilder } from "@/sections/section-builder";
import type { IMyProfilePageBuilderProps } from "./interface";

export function MyProfilePageBuilder({
  profile,
  data,
}: IMyProfilePageBuilderProps) {
  const activeProfile = profile ?? data?.profile ?? null;

  return (
    <div className="bg-background">
      <HeroBuilder profile={activeProfile} />
      <SectionBuilder sections={activeProfile?.sections} />
    </div>
  );
}

export default MyProfilePageBuilder;

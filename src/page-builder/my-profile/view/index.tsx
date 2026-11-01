import { HeroBuilder } from "@/sections/hero";
import { SectionBuilder } from "@/sections/section-builder";
import type { IMyProfilePageBuilderProps } from "./interface";

export function MyProfilePageBuilder({ data }: IMyProfilePageBuilderProps) {
  const { profile } = data;

  return (
    <div className="bg-background">
      <HeroBuilder profile={profile} />
      <SectionBuilder sections={profile?.sections} />
    </div>
  );
}

export default MyProfilePageBuilder;

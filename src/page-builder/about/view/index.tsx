import { AboutIntroSectionBuilder } from "@/sections/about-intro/builder";
import { SectionBuilder } from "@/sections/section-builder";
import type { IAboutPageBuilderProps } from "./interface";

export function AboutPageBuilder({ page }: IAboutPageBuilderProps) {
  return (
    <main className="pt-8 pb-28">
      {page.aboutIntro && <AboutIntroSectionBuilder data={page.aboutIntro} />}
      <SectionBuilder sections={page.sections} />
    </main>
  );
}

export default AboutPageBuilder;

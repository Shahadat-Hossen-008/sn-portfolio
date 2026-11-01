import { PageIntroSectionBuilder } from "@/sections/page-intro/builder";
import { SectionBuilder } from "@/sections/section-builder";
import type { IAboutPageBuilderProps } from "./interface";

export function AboutPageBuilder({ page }: IAboutPageBuilderProps) {
  return (
    <main className="pt-8 pb-28">
      {page.pageIntro && <PageIntroSectionBuilder data={page.pageIntro} />}
      <SectionBuilder sections={page.sections} numbered={false} />
    </main>
  );
}

export default AboutPageBuilder;

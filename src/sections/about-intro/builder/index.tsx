import { AboutIntroSection } from "../index";
import type { IAboutIntroProps } from "../interface";
import type { ISanityAboutIntroProps } from "./interface";

export function AboutIntroSectionBuilder({ data }: ISanityAboutIntroProps) {
  const heading = data?.heading?.trim();
  if (!heading) return null;

  const props: IAboutIntroProps = {
    eyebrow: data.eyebrow?.trim() || undefined,
    heading,
    headingAccent: data.headingAccent,
    intro: data.intro?.trim() || undefined,
    body: data.body?.trim() || undefined,
  };

  return <AboutIntroSection {...props} />;
}

export default AboutIntroSectionBuilder;

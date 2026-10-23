import { AboutSection } from "../index";
import type { IAboutSectionProps } from "../interface";
import type { ISanityAboutSectionProps } from "./interface";

export function AboutSectionBuilder({ about }: ISanityAboutSectionProps) {
  if (!about) return null;

  const props: IAboutSectionProps = {
    description: about.description,
    technologies: about.technologies,
  };

  return <AboutSection {...props} />;
}

export default AboutSectionBuilder;

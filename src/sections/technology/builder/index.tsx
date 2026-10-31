import { TechnologySection } from "../index";
import type { ITechnologySectionProps } from "../interface";
import type { ISanityTechnologySectionProps } from "./interface";

export function TechnologySectionBuilder({
  technology,
}: ISanityTechnologySectionProps) {
  const props: ITechnologySectionProps = {
    technology: technology ?? [],
  };

  return <TechnologySection {...props} />;
}

export default TechnologySectionBuilder;

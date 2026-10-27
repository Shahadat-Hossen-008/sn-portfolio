import { PageIntroSection } from "../index";
import type { IPageIntroProps } from "../interface";
import type { ISanityPageIntroProps } from "./interface";

export function PageIntroSectionBuilder({ data }: ISanityPageIntroProps) {
  const heading = data?.heading?.trim();
  if (!data || !heading) {
    return null;
  }

  const props: IPageIntroProps = {
    eyebrow: data.eyebrow?.trim() || undefined,
    heading,
    headingAccent: data.headingAccent,
    intro: data.intro?.trim() || undefined,
    body: data.body?.trim() || undefined,
  };

  return <PageIntroSection {...props} />;
}

export default PageIntroSectionBuilder;
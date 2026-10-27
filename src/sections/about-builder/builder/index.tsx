import { cleanFacts, cleanNotes } from "@/sections/about-builder/helpers";
import { splitHeadline } from "@/lib/hero";
import { resolveLink } from "@/lib/sanity/links";
import { AboutBuilderSection } from "../index";
import type { IAboutBuilderProps } from "../interface";
import type { ISanityAboutBuilderProps } from "./interface";
import { getSectionLabel } from "@/lib/sectionLabel";

export function AboutBuilderSectionBuilder({
  data,
  sectionNumber,
}: ISanityAboutBuilderProps) {
  const heading = data?.heading?.trim();
  if (!heading) return null;

  const cta = data.cta;
  const ctaLabel = cta?.label?.trim();
  const ctaHref = cta && !cta.isDisabled && ctaLabel ? resolveLink(cta) : null;

  const props: IAboutBuilderProps = {
    label: getSectionLabel(sectionNumber, data.eyebrow),
    headingParts: splitHeadline(heading, data.headingAccent),
    intro: data.intro?.trim() || undefined,
    notes: cleanNotes(data.columns),
    facts: cleanFacts(data.facts),
    cta:
      ctaHref && ctaLabel
        ? {
            href: ctaHref,
            label: ctaLabel,
            openInNewTab: cta?.openInNewTab === true,
          }
        : null,
  };

  return <AboutBuilderSection {...props} />;
}

export default AboutBuilderSectionBuilder;

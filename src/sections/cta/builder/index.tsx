import { resolveLink } from "@/sanity/lib/links";
import { CtaSection } from "../index";
import type { ICtaSectionProps } from "../interface";
import type { ISanityCtaProps } from "./interface";

export function CtaSectionBuilder({ data }: ISanityCtaProps) {
  const heading = data?.heading?.trim();
  if (!heading) return null;

  const cta = data.cta;
  const ctaLabel = cta?.label?.trim();
  const ctaHref = cta && !cta.isDisabled && ctaLabel ? resolveLink(cta) : null;

  const props: ICtaSectionProps = {
    eyebrow: data.eyebrow?.trim() || undefined,
    heading,
    headingAccent: data.headingAccent,
    intro: data.intro?.trim() || undefined,
    cta:
      ctaHref && ctaLabel
        ? {
            href: ctaHref,
            label: ctaLabel,
            openInNewTab: cta?.openInNewTab === true,
          }
        : null,
  };

  return <CtaSection {...props} />;
}

export default CtaSectionBuilder;

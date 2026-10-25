import { LINK_REFERENCE_FRAGMENT } from "@/fragments";

/** Projection for the `ctaSection` block on pageSections. */
export const ctaSectionFragment = /* groq */ `{
  eyebrow,
  heading,
  headingAccent,
  intro,
  cta {
    label,
    type,
    url,
    openInNewTab,
    isDisabled,
    ${LINK_REFERENCE_FRAGMENT}
  }
}`;

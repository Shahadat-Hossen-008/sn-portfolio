import { LINK_REFERENCE_FRAGMENT } from "@/fragments";

/** Projection for the optional `aboutBuilderSection` block on myProfilePage. */
export const aboutBuilderSectionFragment = /* groq */ `{
  eyebrow,
  heading,
  headingAccent,
  intro,
  columns[]{ _key, label, text },
  facts[]{ _key, label, value },
  cta { label, type, url, openInNewTab, isDisabled, ${LINK_REFERENCE_FRAGMENT} }
}`;

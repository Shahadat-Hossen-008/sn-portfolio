import { LINK_REFERENCE_FRAGMENT } from "@/fragments";

export const HEADER_FRAGMENT = /* groq */ `
  header {
    links[]{
      _key,
      label,
      type,
      url,
      openInNewTab,
      isDisabled,
      ${LINK_REFERENCE_FRAGMENT}
    },
    cta {
      label,
      type,
      url,
      openInNewTab,
      isDisabled,
      ${LINK_REFERENCE_FRAGMENT}
    },
    showSocialLinks
  }
`;

import { LINK_REFERENCE_FRAGMENT } from "@/fragments";

export const FOOTER_FRAGMENT = /* groq */ `
  footer {
    mainContent,
    email,
    phone,
    base,
    columns[]{
      _key,
      label,
      type,
      url,
      openInNewTab,
      isDisabled,
      ${LINK_REFERENCE_FRAGMENT}
    }
  }
`;

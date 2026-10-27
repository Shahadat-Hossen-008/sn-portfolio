import { LINK_REFERENCE_FRAGMENT } from "@/fragments";

export const PRIMARY_HERO_FRAGMENT = /* groq */ `
  hero {
    statusLabel,
    location,
    headline,
    headlineAccent,
    subline,
    primaryCta {
      label,
      type,
      url,
      openInNewTab,
      isDisabled,
      ${LINK_REFERENCE_FRAGMENT}
    },
    secondaryCta {
      label,
      type,
      url,
      openInNewTab,
      isDisabled,
      ${LINK_REFERENCE_FRAGMENT}
    },
    portrait {
      imageFile {
        asset->{_id, url, metadata{dimensions{width, height}}}
      },
      altText
    },
    nowBuilding { title, progress },
    facts[]{ label, value }
  }
`;

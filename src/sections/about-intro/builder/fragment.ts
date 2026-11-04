import { CUSTOM_IMAGE_FRAGMENT, SECTION_HEADING_FRAGMENT } from "@/fragments";

/** Projection for the `aboutIntro` field on aboutPage. */
export const ABOUT_INTRO_FRAGMENT = /* groq */ `
  aboutIntro {
    ${SECTION_HEADING_FRAGMENT},
    portrait {
      ${CUSTOM_IMAGE_FRAGMENT}
    },
    intro,
    body
  }
`;

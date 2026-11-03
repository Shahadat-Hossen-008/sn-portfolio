import { CUSTOM_IMAGE_FRAGMENT, LINK_REFERENCE_FRAGMENT } from "@/fragments";

/** Projection for the personal introduction bento grid on pages. */
export const personalIntroSectionFragment = /* groq */ `{
  heading,
  capabilities {
    eyebrow,
    items[]{ _key, title, description }
  },
  personalIntro {
    eyebrow,
    title,
    bio,
    cta { label, type, url, openInNewTab, isDisabled, ${LINK_REFERENCE_FRAGMENT} }
  },
  work {
    eyebrow,
    project->{
      _id,
      "title": projectTitle,
      "year": string::split(date, "-")[0],
      "summary": coalesce(problemStatement, projectDescription),
      "image": projectImage {
        ${CUSTOM_IMAGE_FRAGMENT}
      },
      "slug": slug.current,
      liveLink,
      caseStudyLink { label, type, url, openInNewTab, isDisabled, ${LINK_REFERENCE_FRAGMENT} }
    },
    image {
      ${CUSTOM_IMAGE_FRAGMENT}
    }
  },
  learning {
    eyebrow,
    title,
    status
  },
  beyondCode {
    eyebrow,
    statement,
    interests
  },
  availability {
    eyebrow,
    statusLabel,
    status,
    cta { label, type, url, openInNewTab, isDisabled, ${LINK_REFERENCE_FRAGMENT} }
  }
}`;

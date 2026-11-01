import { LINK_REFERENCE_FRAGMENT } from "@/fragments";

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
        imageFile {
          asset->{_id, url, metadata{dimensions{width, height}}}
        },
        altText
      },
      "slug": slug.current,
      liveLink,
      caseStudyLink { label, type, url, openInNewTab, isDisabled, ${LINK_REFERENCE_FRAGMENT} }
    },
    image {
      imageFile {
        asset->{_id, url, metadata{dimensions{width, height}}}
      },
      altText
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

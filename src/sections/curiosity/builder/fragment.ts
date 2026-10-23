import { LINK_REFERENCE_FRAGMENT } from "@/fragments";

/** Projection for the optional, fixed-tile curiosity block on myProfilePage. */
export const curiositySectionFragment = /* groq */ `{
  eyebrow,
  heading,
  headingAccent,
  intro,
  stack {
    title,
    groups[]{
      label,
      description,
      items[]{ isPrimary, "tech": tech->{ label } }
    }
  },
  learning { title, topics, upNext },
  passion { statement },
  interests { title, items },
  work {
    title,
    cta { label, type, url, openInNewTab, isDisabled, ${LINK_REFERENCE_FRAGMENT} },
    "projects": select(
      count(projects) > 0 => projects[]->{
        _id,
        "title": projectTitle,
        "year": string::split(date, "-")[0],
        "tech": stack[]->label,
        projectLink {
          label,
          type,
          url,
          openInNewTab,
          isDisabled,
          ${LINK_REFERENCE_FRAGMENT}
        }
      },
      *[_type == "project"] | order(date desc, _createdAt desc)[0...3]{
        _id,
        "title": projectTitle,
        "year": string::split(date, "-")[0],
        "tech": stack[]->label,
        projectLink {
          label,
          type,
          url,
          openInNewTab,
          isDisabled,
          ${LINK_REFERENCE_FRAGMENT}
        }
      }
    )
  }
}`;

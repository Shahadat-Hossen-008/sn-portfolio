import { defineArrayMember, defineType } from "sanity";

/**
 * One reference member per section document.
 * `name` must equal the document type so insertMenu groups can find it.
 */
const sectionRef = (type: string, title: string) =>
  defineArrayMember({
    name: type,
    title,
    type: "reference",
    to: [{ type }],
    validation: (rule) => rule.required().error("Please select a section."),
  });

export const pageSection = defineType({
  name: "pageSections",
  title: "Page Sections",
  type: "array",
  description:
    "The sections shown on this page, in order. Create sections under Page Sections, then pick them here. One section can be reused on several pages.",
  of: [
    sectionRef("curiositySection", "Stack & Curiosity"),
    sectionRef("aboutBuilderSection", "About the builder"),
    sectionRef("richTextSection", "Rich Text"),
    sectionRef("technologySection", "Technology"),
    sectionRef("technologyCarousel", "Carousel Technology"),
  ],
  options: {
    insertMenu: {
      filter: true,
      views: [{ name: "grid" }],
      groups: [
        {
          name: "profile",
          title: "About me",
          of: ["curiositySection", "aboutBuilderSection"],
        },
        {
          name: "sections",
          title: "Content",
          of: ["richTextSection", "technologyCarousel", "technologySection"],
        },
      ],
    },
  },
});

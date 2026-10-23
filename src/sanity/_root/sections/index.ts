import { defineArrayMember, defineType } from "sanity";

export const pageSection = defineType({
  name: "pageSections",
  title: "Page Sections",
  type: "array",
  of: [
    defineArrayMember({
      title: "Stack & Curiosity",
      name: "curiositySection",
      type: "reference",
      to: [{ type: "curiositySection" }],
      validation: (rule) => rule.required().error("Please select a section."),
    }),
    defineArrayMember({
      title: "Rich Text",
      name: "richTextSection",
      type: "reference",
      to: [{ type: "richTextSection" }],
      validation: (rule) => rule.required().error("Please select a section."),
    }),
    defineArrayMember({
      title: "Technology",
      name: "technologySection",
      type: "reference",
      to: [{ type: "technologySection" }],
      validation: (rule) => rule.required().error("Please select a section."),
    }),
    defineArrayMember({
      title: "Carousel Technology",
      name: "technologyCarousel",
      type: "reference",
      to: [{ type: "technologyCarousel" }],
      validation: (rule) => rule.required().error("Please select a section."),
    }),
  ],
  options: {
    insertMenu: {
      filter: true,
      views: [
        {
          name: "grid",
        },
      ],
      groups: [
        {
          name: "profile",
          of: ["curiositySection"],
        },
        {
          name: "sections",
          of: [
            "richTextSection",
            "technologyCarousel",
            "technologySection",
          ],
        },
      ],
    },
  },
});

import { BsLightbulb } from "react-icons/bs";
import { defineArrayMember, defineField, defineType } from "sanity";

import { countLabel } from "@/sanity/lib/preview";

export const philosophySection = defineType({
  name: "philosophySection",
  title: "Philosophy",
  type: "document",
  icon: BsLightbulb,
  description:
    "Engineering philosophy section (e.g. Mentorship, Open Source, Design Systems, Code Style) highlighting your team values, craft, and collaboration culture.",
  fields: [
    defineField({
      name: "title",
      title: "Section Reference Title (CMS only)",
      type: "string",
      description:
        "Optional internal title for this document in the Studio sidebar, e.g. “Core Engineering Philosophy”.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow / Section Label",
      type: "string",
      initialValue: "PHILOSOPHY",
      description:
        "The section tag on the left column, e.g. “PHILOSOPHY”.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "items",
      title: "Philosophy Principles",
      type: "array",
      description:
        "The core principles (e.g. Mentorship, Open Source, Design Systems, Code Style) displayed in a 2-column grid. Drag to reorder.",
      validation: (rule) => rule.required().min(1).max(6),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Principle Title",
              type: "string",
              description:
                "Name of the principle, e.g. “Mentorship”, “Open Source”, “Design Systems”, or “Code Style”.",
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 4,
              description:
                "Clear, opinionated explanation of your belief and standard.",
              validation: (rule) => rule.required().max(400),
            }),
            defineField({
              name: "tag",
              title: "Category / Subtitle (Optional)",
              type: "string",
              description:
                "Optional small tag or sub-label displayed beneath the description, e.g. “Team culture”, “Community”, or “UI Architecture”.",
              validation: (rule) => rule.max(30),
            }),
          ],
          preview: {
            select: { title: "title", tag: "tag", description: "description" },
            prepare: ({ title, tag, description }) => ({
              title: title || "Principle",
              subtitle: tag || description || "Philosophy item",
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      eyebrow: "eyebrow",
      items: "items",
    },
    prepare: ({ title, eyebrow, items }) => ({
      title: title || eyebrow || "Philosophy",
      subtitle: countLabel(items?.length, "principle"),
    }),
  },
});

export default philosophySection;

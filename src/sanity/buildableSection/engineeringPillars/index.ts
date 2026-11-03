import { BsPersonLinesFill } from "react-icons/bs";
import { defineArrayMember, defineField, defineType } from "sanity";

export const engineeringPillars = defineType({
  name: "engineeringPillars",
  title: "Engineering Pillars",
  type: "document",
  icon: BsPersonLinesFill,
  description:
    "Three-column engineering pillars (e.g. What I Can Bring, How I Work, and Things I Enjoy) outlining your value, philosophy, and craft for recruiters and engineering leaders.",
  fields: [
    defineField({
      name: "title",
      title: "Section Title (Internal CMS Reference)",
      type: "string",
      description:
        "Descriptive name for this section in the Studio sidebar, e.g. “Core Engineering Pillars”. Not displayed on the public website.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "columns",
      title: "Pillars",
      type: "array",
      description:
        "The core pillars (typically three: What I Can Bring, How I Work, Things I Enjoy) displayed side by side in a clean horizontal grid.",
      validation: (rule) => rule.required().min(1).max(4),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label / Eyebrow",
              type: "string",
              description:
                "Title of this pillar (e.g. “01 / WHAT I CAN BRING” or “WHAT I CAN BRING”). You can include numbers or text as you wish. Max 40 characters.",
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: "statement",
              title: "Primary Statement",
              type: "text",
              rows: 3,
              description:
                "Bold primary statement summarizing your capability or philosophy in this pillar. Max 200 characters.",
              validation: (rule) => rule.required().max(200),
            }),
            defineField({
              name: "items",
              title: "Detail Points",
              type: "array",
              description:
                "Bullet points displayed in italic under the primary statement. Up to 6 items.",
              validation: (rule) => rule.max(6),
              of: [
                defineArrayMember({
                  type: "string",
                  description:
                    "Specific aspect or discipline, e.g. “Architecture of content and systems”.",
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "statement" },
            prepare: ({ title, subtitle }) => ({
              title: title || "Pillar",
              subtitle: subtitle || "Pillar statement",
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      columns: "columns",
    },
    prepare: ({ title, columns }) => ({
      title: title || "Engineering Pillars",
      subtitle: `${columns?.length ?? 0} pillar${(columns?.length ?? 0) === 1 ? "" : "s"}`,
    }),
  },
});

export default engineeringPillars;

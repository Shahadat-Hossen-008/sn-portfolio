import { BsDiagram3 } from "react-icons/bs";
import { defineArrayMember, defineField, defineType } from "sanity";

import { sectionHeaderFields } from "@/sanity/_root/section-header";
import { countLabel } from "@/sanity/lib/preview";

export const processSection = defineType({
  name: "processSection",
  title: "Process",
  type: "document",
  icon: BsDiagram3,
  description:
    "How you work, step by step, with the tools used at each step. Shown as a numbered list on the right, beside a heading that stays in view while scrolling.",
  fields: [
    ...sectionHeaderFields({
      headingMax: 50,
      introMax: 120,
      headingDescription:
        "Heading in the left column, e.g. “Tools follow the problem.”. Max 50 characters.",
      introDescription:
        "One or two sentences under the heading, e.g. how you choose technology. Max 120 characters.",
    }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      description:
        "The steps of your process, in order. Drag to reorder; the numbers update by themselves. Up to five, so the list stays scannable.",
      validation: (rule) => rule.max(5),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description:
                "Name of the step, e.g. “Understand”. The step number (01, 02…) is added automatically from the order, so don't type it. Max 16 characters.",
              validation: (rule) => rule.required().max(16),
            }),
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
              description:
                "The step's sentence, shown large, e.g. “Find the shape of the problem”. Max 40 characters so it stays on two lines.",
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: "tools",
              title: "Tools",
              type: "array",
              description:
                "Technologies used in this step, shown as small tags. Pick from your technology tags so names stay consistent. Max 4, because the tags must fit on two lines.",
              validation: (rule) => rule.max(4).unique(),
              of: [
                defineArrayMember({
                  type: "reference",
                  to: [{ type: "techTag" }],
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "heading", subtitle: "label" },
            prepare: ({ title, subtitle }) => ({
              title: title || "Step",
              subtitle,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading", steps: "steps" },
    prepare: ({ title, steps }) => ({
      title: title || "Process",
      subtitle: countLabel(steps?.length, "step"),
    }),
  },
});

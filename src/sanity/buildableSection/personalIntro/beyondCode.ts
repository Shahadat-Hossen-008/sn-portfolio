import { defineArrayMember, defineField } from "sanity";

const collapsedTile = { collapsible: true, collapsed: true };

export const beyondCodeField = defineField({
  name: "beyondCode",
  title: "Beyond code tile",
  type: "object",
  description:
    "Bottom-middle tile: things you appreciate outside work (photography, typography, architecture).",
  options: collapsedTile,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow label",
      type: "string",
      description:
        "Small uppercase label, e.g. Beyond code. Max 30 characters.",
      initialValue: "Beyond code",
      validation: (rule) => rule.max(30),
    }),
    defineField({
      name: "statement",
      title: "Statement",
      type: "text",
      rows: 2,
      description:
        "One sentence about your creative interests outside coding. Max 140 characters.",
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: "interests",
      title: "Interests",
      type: "array",
      description:
        "Up to 4 short interest names, e.g. Photography, Typography, Architecture.",
      validation: (rule) => rule.max(4),
      of: [
        defineArrayMember({
          type: "string",
          validation: (rule) => rule.max(30),
        }),
      ],
    }),
  ],
});

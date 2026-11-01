import { defineField } from "sanity";

const collapsedTile = { collapsible: true, collapsed: true };

export const learningField = defineField({
  name: "learning",
  title: "Currently building tile",
  type: "object",
  description: "Bottom-left tile: what you are actively building or exploring.",
  options: collapsedTile,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow label",
      type: "string",
      description:
        "Small uppercase label, e.g. Currently building. Max 30 characters.",
      initialValue: "Currently building",
      validation: (rule) => rule.max(30),
    }),
    defineField({
      name: "title",
      title: "Current focus",
      type: "string",
      description:
        "One clear line about what you are actively building or exploring. Max 140 characters.",
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: "status",
      title: "Status label",
      type: "string",
      description:
        "Status indicator text, e.g. In progress. Max 30 characters.",
      initialValue: "In progress",
      validation: (rule) => rule.max(30),
    }),
  ],
});

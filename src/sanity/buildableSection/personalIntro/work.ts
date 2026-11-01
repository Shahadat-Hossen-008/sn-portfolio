import { defineField } from "sanity";

const collapsedTile = { collapsible: true, collapsed: true };

export const workField = defineField({
  name: "work",
  title: "Selected project tile",
  type: "object",
  description:
    "Top-right dark tile: references a single featured project entity and optional custom preview image.",
  options: collapsedTile,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow label",
      type: "string",
      description:
        "Small uppercase label, e.g. Selected Project. Max 30 characters.",
      initialValue: "Selected Project",
      validation: (rule) => rule.max(30),
    }),
    defineField({
      name: "project",
      title: "Featured project",
      type: "reference",
      to: [{ type: "project" }],
      description: "The single project entity featured in this tile.",
    }),
    defineField({
      name: "image",
      title: "Custom preview image",
      type: "customImage",
      description:
        "Optional custom screenshot or preview image. If omitted, uses the featured project's card image.",
    }),
  ],
});

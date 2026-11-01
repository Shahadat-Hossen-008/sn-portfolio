import { defineArrayMember, defineField } from "sanity";

/** Every tile starts collapsed in the Studio. */
const collapsedTile = { collapsible: true, collapsed: true };

export const capabilitiesField = defineField({
  name: "capabilities",
  title: "What I build strip",
  type: "object",
  description:
    "Numbered strip shown above the grid: 1–4 short statements about what you build. Numbers follow the order.",
  options: collapsedTile,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow label",
      type: "string",
      description:
        "Small uppercase label above the strip, e.g. What I build. Max 30 characters.",
      initialValue: "What I build",
      validation: (rule) => rule.max(30),
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      description:
        "1 to 4 capabilities. Each has a short title and a 2–4 line description.",
      validation: (rule) => rule.max(4),
      of: [
        defineArrayMember({
          name: "capability",
          title: "Capability",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              description:
                "What you build, in a few words. Max 40 characters.",
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              description:
                "The concrete result or approach in 2–4 lines. Max 120 characters.",
              validation: (rule) => rule.max(120),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
            prepare: ({ title, subtitle }) => ({
              title: title || "Capability",
              subtitle,
            }),
          },
        }),
      ],
    }),
  ],
});

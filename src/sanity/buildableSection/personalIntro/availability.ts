import { defineField } from "sanity";
import { link } from "@/sanity/_root/link";

const collapsedTile = { collapsible: true, collapsed: true };

export const availabilityField = defineField({
  name: "availability",
  title: "Availability tile",
  type: "object",
  description:
    "Bottom-right tile: current work availability and direct contact action.",
  options: collapsedTile,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow label",
      type: "string",
      description:
        "Small uppercase label, e.g. Availability. Max 30 characters.",
      initialValue: "Availability",
      validation: (rule) => rule.max(30),
    }),
    defineField({
      name: "statusLabel",
      title: "Status category label",
      type: "string",
      description: "Label above status, e.g. Status. Max 20 characters.",
      initialValue: "Status",
      validation: (rule) => rule.max(20),
    }),
    defineField({
      name: "status",
      title: "Availability status",
      type: "string",
      description:
        "Your current working status, e.g. Open to collaborations. Max 40 characters.",
      initialValue: "Open to collaborations",
      validation: (rule) => rule.max(40),
    }),
    {
      ...link("cta"),
      title: "Contact action",
      description: "Email or contact action link.",
    },
  ],
});

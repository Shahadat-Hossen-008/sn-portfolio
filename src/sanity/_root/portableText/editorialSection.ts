import { defineArrayMember, defineField, defineType } from "sanity";
import { SplitVerticalIcon } from "@sanity/icons";
import { toPlainText } from "@portabletext/react";
import { block } from "./block";

export const editorialSection = defineType({
  name: "editorialSection",
  type: "object",
  title: "Editorial Section (Column / Straightforward)",
  icon: SplitVerticalIcon,
  fields: [
    defineField({
      name: "layout",
      title: "Section Layout",
      description:
        "Choose 'Two-Column' for left label + right narrative (case study style), or 'Straightforward' for a single full-width narrative column.",
      type: "string",
      initialValue: "twoColumn",
      options: {
        layout: "radio",
        direction: "horizontal",
        list: [
          { title: "Two-Column (Label Left, Text Right)", value: "twoColumn" },
          { title: "Straightforward (Single Column)", value: "straightforward" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Section Label",
      description:
        "Short uppercase label shown on the left column (e.g. 'THE PROBLEM', 'THE APPROACH', 'THE OUTCOME').",
      type: "string",
    }),
    defineField({
      name: "autoNumber",
      title: "Auto-number Section Label",
      description:
        "When enabled, automatically prefixes the label with its sequential number (e.g. '01 — THE PROBLEM', '02 — THE APPROACH').",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "heading",
      title: "Section Heading",
      description:
        "Lead display heading at the top of the right column (e.g. 'Publishing tools should not get in the way of reading.').",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Narrative Body",
      description:
        "Rich text paragraphs, bullet points, and links for this editorial section.",
      type: "array",
      of: [defineArrayMember(block)],
      validation: (rule) =>
        rule.required().error("Please provide the narrative content."),
    }),
  ],
  preview: {
    select: {
      label: "label",
      heading: "heading",
      layout: "layout",
      body: "body",
    },
    prepare({ label, heading, layout, body }) {
      const fallbackText = body ? toPlainText(body).slice(0, 50) : "";
      const title = heading || label || fallbackText || "Editorial Section";
      const modeLabel =
        layout === "straightforward" ? "Straightforward" : "Two-Column";
      const subtitle = label
        ? `${modeLabel} · ${label}`
        : `${modeLabel} Editorial Section`;

      return {
        title,
        subtitle,
        media: SplitVerticalIcon,
      };
    },
  },
});

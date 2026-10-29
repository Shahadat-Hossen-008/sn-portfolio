import { defineArrayMember, defineField, defineType } from "sanity";
import { ThLargeIcon } from "@sanity/icons";

export const decisionCardItem = defineType({
  name: "decisionCardItem",
  type: "object",
  title: "Decision Card",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow Label",
      description: "Defaults to 'DECISION' when left blank.",
      type: "string",
      initialValue: "DECISION",
    }),
    defineField({
      name: "title",
      title: "Decision Title",
      description: "Concise headline (e.g. 'Editor-first schema').",
      type: "string",
      validation: (rule) =>
        rule.required().error("Decision card title is required."),
    }),
    defineField({
      name: "description",
      title: "Rationale / Description",
      description:
        "2–3 sentences explaining why this decision was made and the trade-off.",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.required().error("Decision card rationale is required."),
    }),
  ],
  preview: {
    select: {
      title: "title",
      eyebrow: "eyebrow",
      description: "description",
    },
    prepare({ title, eyebrow, description }) {
      return {
        title: title || "Decision Card",
        subtitle: `${eyebrow || "DECISION"} — ${description || ""}`.slice(
          0,
          70,
        ),
      };
    },
  },
});

export const decisionCards = defineType({
  name: "decisionCards",
  type: "object",
  title: "Decision Cards Grid",
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: "cards",
      title: "Decision Cards",
      description:
        "Key architectural or product decisions rendered in a 3-column forest card grid.",
      type: "array",
      of: [defineArrayMember({ type: "decisionCardItem" })],
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .max(6)
          .error("Add between 1 and 6 decision cards."),
    }),
  ],
  preview: {
    select: {
      cards: "cards",
    },
    prepare({ cards }) {
      const count = Array.isArray(cards) ? cards.length : 0;
      const firstTitle =
        Array.isArray(cards) && cards[0]?.title ? cards[0].title : "";

      return {
        title: firstTitle
          ? `Decisions: ${firstTitle}${count > 1 ? ` (+${count - 1} more)` : ""}`
          : "Decision Cards Grid",
        subtitle: `${count} decision card${count === 1 ? "" : "s"}`,
        media: ThLargeIcon,
      };
    },
  },
});

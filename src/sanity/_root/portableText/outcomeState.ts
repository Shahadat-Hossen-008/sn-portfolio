import { defineArrayMember, defineField, defineType } from "sanity";
import { BarChartIcon } from "@sanity/icons";

export const outcomeStateItem = defineType({
  name: "outcomeStateItem",
  type: "object",
  title: "Outcome Item",
  fields: [
    defineField({
      name: "value",
      title: "Outcome / Capability",
      description:
        "Concrete capability or deliverable unlocked (e.g. 'Walk-in ready', 'Group booking', 'Unified cart', '2 regions'). Avoid unverifiable vanity percentages.",
      type: "string",
      validation: (rule) =>
        rule.required().error("Outcome / capability headline is required."),
    }),
    defineField({
      name: "label",
      title: "What It Provides",
      description:
        "Concise statement of what this outcome provides to users or editors (e.g. 'Purchase without creating an account', 'Managed from one Studio').",
      type: "string",
      validation: (rule) =>
        rule.required().error("Please describe what this outcome provides."),
    }),
  ],
  preview: {
    select: {
      value: "value",
      label: "label",
    },
    prepare({ value, label }) {
      return {
        title: value || "Outcome",
        subtitle: label || "",
      };
    },
  },
});

export const outcomeState = defineType({
  name: "outcomeState",
  type: "object",
  title: "Outcome State (What It Provides)",
  icon: BarChartIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Optional Heading",
      description:
        "Optional heading displayed above the outcome boxes (e.g. 'Outcomes').",
      type: "string",
    }),
    defineField({
      name: "stats",
      title: "Outcomes",
      description:
        "Concrete capabilities and deliverables rendered in a unified 1px bordered grid (e.g. 'Walk-in ready' — 'Purchase without creating an account').",
      type: "array",
      of: [defineArrayMember({ type: "outcomeStateItem" })],
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .max(6)
          .error("Add between 1 and 6 outcomes."),
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      stats: "stats",
    },
    prepare({ heading, stats }) {
      const count = Array.isArray(stats) ? stats.length : 0;
      const summary = Array.isArray(stats)
        ? stats
            .slice(0, 3)
            .map((s) => `${s?.value ?? ""} — ${s?.label ?? ""}`.trim())
            .filter(Boolean)
            .join(" · ")
        : "";

      return {
        title: heading || summary || "Outcome Boxes",
        subtitle: `${count} outcome${count === 1 ? "" : "s"}`,
        media: BarChartIcon,
      };
    },
  },
});

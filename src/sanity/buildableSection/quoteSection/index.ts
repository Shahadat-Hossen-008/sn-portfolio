import { BsChatQuote } from "react-icons/bs";
import { defineField, defineType } from "sanity";

import { splitHeadline } from "@/sanity/lib/hero";

export const quoteSection = defineType({
  name: "quoteSection",
  title: "Quote",
  type: "document",
  icon: BsChatQuote,
  description:
    "A pull quote with an optional highlighted phrase and a short side note, shown as a pause between sections.",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 3,
      description:
        "The quote, shown large. Max 90 characters so it stays within three lines.",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "quoteAccent",
      title: "Quote accent",
      type: "string",
      description:
        "Optional. A phrase from the quote shown in italic with a highlight. It must appear in the quote exactly, including capital letters.",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (typeof value !== "string" || !value.trim()) return true;
          const quote = (context.parent as { quote?: string } | undefined)
            ?.quote;
          return splitHeadline(quote, value).length === 3
            ? true
            : "Quote accent must appear in the quote with matching case.";
        }),
    }),
    defineField({
      name: "note",
      title: "Side note",
      type: "text",
      rows: 2,
      description:
        "Optional short note shown to the right of the quote. Max 90 characters.",
      validation: (rule) => rule.max(90),
    }),
  ],
  preview: {
    select: { title: "quote", subtitle: "note" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Quote",
      subtitle: subtitle || "Pull quote",
    }),
  },
});

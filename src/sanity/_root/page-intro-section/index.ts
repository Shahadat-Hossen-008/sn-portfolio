import { BsFileEarmarkText } from "react-icons/bs";
import { defineField, defineType } from "sanity";

import { sectionHeaderFields } from "@/sanity/_root/section-header";

export const PageIntroSection = defineType({
  name: "pageIntroSection",
  title: "Page intro",
  type: "object",
  icon: BsFileEarmarkText,
  description:
    "The opening of the page: a large heading on the left, and a lead sentence with a short paragraph on the right.",
  fields: [
    ...sectionHeaderFields({
      headingMax: 60,
      introMax: 140,
      headingDescription:
        "The main heading of the page, shown large on the left. Max 60 characters.",
      introDescription:
        "The lead sentence, shown first on the right in larger text. Max 140 characters.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 4,
      description:
        "A short paragraph under the lead sentence. Max 220 characters so the right column stays no taller than the heading.",
      validation: (rule) => rule.max(220),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Page intro",
      subtitle: subtitle || "Page opening",
    }),
  },
});

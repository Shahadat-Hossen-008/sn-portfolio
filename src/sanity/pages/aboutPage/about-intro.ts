import { defineField } from "sanity";

import { sectionHeaderFields } from "@/sanity/_root/section-header";

export const aboutIntroField = defineField({
  name: "aboutIntro",
  title: "About Intro",
  type: "object",
  description:
    "The opening of the About page: headline with optional accent, portrait image on the left, and narrative text on the right.",
  fields: [
    ...sectionHeaderFields({
      headingMax: 60,
      headingDescription:
        "Main headline of the About page, e.g. “I build with care, not noise.”. Max 60 characters.",
    }),
    defineField({
      name: "portrait",
      title: "Portrait photo",
      type: "customImage",
      description:
        "Your portrait photo displayed on the left column beside your narrative text.",
    }),
    defineField({
      name: "intro",
      title: "Lead statement",
      type: "text",
      rows: 3,
      description:
        "The bold lead paragraph, displayed first in larger text on the right. Max 160 characters.",
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "body",
      title: "Detail narrative",
      type: "text",
      rows: 4,
      description:
        "Secondary detail paragraph describing your engineering background, values, and craft. Max 350 characters.",
      validation: (rule) => rule.max(350),
    }),
  ],
});

import { BsPersonLinesFill } from "react-icons/bs";
import { defineArrayMember, defineField, defineType } from "sanity";

import { link } from "@/sanity/_root/link";
import { splitHeadline } from "@/lib/hero";

export const aboutBuilderSection = defineType({
  name: "aboutBuilderSection",
  title: "About the builder",
  type: "document",
  icon: BsPersonLinesFill,
  description:
    "A short “about me” teaser for the home page: a heading and lead sentence, two short notes, three quick facts and a button to the About page.",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description:
        "Small label above the heading, e.g. “About the builder”. The section number (“03 —”) is added automatically, so don't type it. Max 40 characters.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description:
        "Main heading of the section. It shows beside the two notes, so aim for two lines. Max 60 characters.",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "headingAccent",
      title: "Heading accent",
      type: "string",
      description:
        "Optional. A phrase from the heading shown in italic with a highlight. It must appear in the heading exactly, including capital letters.",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (typeof value !== "string" || !value.trim()) return true;
          const heading = (context.parent as { heading?: string } | undefined)
            ?.heading;
          return splitHeadline(heading, value).length === 3
            ? true
            : "Heading accent must appear in the heading with matching case.";
        }),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      description:
        "The lead sentence under the heading: who you are in one or two sentences. Max 160 characters.",
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "columns",
      title: "Notes",
      type: "array",
      description:
        "Two short notes shown side by side, e.g. “How I work” and “What to expect”. Maximum two so they fit next to the heading.",
      validation: (rule) => rule.max(2),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description:
                "Small uppercase title of the note, e.g. “How I work”. Max 24 characters so it stays on one line.",
              validation: (rule) => rule.required().max(24),
            }),
            defineField({
              name: "text",
              title: "Text",
              type: "text",
              rows: 3,
              description:
                "The note itself, one or two sentences. Max 150 characters so both notes stay about the same height.",
              validation: (rule) => rule.max(150),
            }),
          ],
          preview: { select: { title: "label", subtitle: "text" } },
        }),
      ],
    }),
    defineField({
      name: "facts",
      title: "Facts",
      type: "array",
      description:
        "Up to three quick facts shown in a row above the button, e.g. where you are based, your focus and your working style.",
      validation: (rule) => rule.max(3),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description:
                "Small uppercase label, e.g. “Focus”. Max 24 characters.",
              validation: (rule) => rule.required().max(24),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description:
                "The fact itself, e.g. “Frontend · Content · Systems”. Max 40 characters so it stays on one line.",
              validation: (rule) => rule.required().max(40),
            }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
    {
      ...link("cta"),
      title: "Call to action",
      description:
        "The button, e.g. “More about me”. It can only link to routes declared in ROUTES_BY_TYPE, so the About page needs a route first.",
    },
  ],
  preview: {
    select: {
      title: "heading",
      eyebrow: "eyebrow",
      columns: "columns",
      facts: "facts",
    },
    prepare: ({ title, eyebrow, columns, facts }) => ({
      title: title || "About the builder",
      subtitle: [
        eyebrow,
        `${columns?.length ?? 0} notes`,
        `${facts?.length ?? 0} facts`,
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});

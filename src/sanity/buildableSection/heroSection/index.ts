import { BsStars } from "react-icons/bs";
import { defineArrayMember, defineField, defineType } from "sanity";

import { link } from "@/sanity/_root/link";
import { splitHeadline } from "@/lib/hero";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "object",
  icon: BsStars,
  fieldsets: [
    {
      name: "headlineFields",
      title: "Headline",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "ctaFields",
      title: "Calls to action",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "nowBuildingFields",
      title: "Now building",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "statusLabel",
      title: "Status Label",
      type: "string",
      validation: (rule) => rule.max(40),
      fieldset: "headlineFields",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (rule) => rule.max(60),
      fieldset: "headlineFields",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required().max(120),
      fieldset: "headlineFields",
    }),
    defineField({
      name: "headlineAccent",
      title: "Headline Accent",
      type: "string",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (typeof value !== "string" || !value.trim()) return true;

          const headline = (context.parent as { headline?: string } | undefined)
            ?.headline;
          return splitHeadline(headline, value).length === 3
            ? true
            : "Headline accent must appear in the headline with matching case.";
        }),
      fieldset: "headlineFields",
    }),
    defineField({
      name: "subline",
      title: "Subline",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(180),
      fieldset: "headlineFields",
    }),
    {
      ...link("primaryCta"),
      title: "Primary CTA",
      fieldset: "ctaFields",
    },
    {
      ...link("secondaryCta"),
      title: "Secondary CTA",
      fieldset: "ctaFields",
    },
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "customImage",
    }),
    defineField({
      name: "nowBuilding",
      title: "Now Building",
      type: "object",
      fieldset: "nowBuildingFields",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.max(100),
        }),
        defineField({
          name: "progress",
          title: "Progress",
          type: "number",
          validation: (rule) => rule.integer().min(0).max(100),
        }),
      ],
    }),
    defineField({
      name: "facts",
      title: "Facts",
      type: "array",
      validation: (rule) => rule.max(4),
      of: [
        defineArrayMember({
          name: "heroFact",
          title: "Fact",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.max(16),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (rule) => rule.max(40),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      headline: "headline",
      statusLabel: "statusLabel",
    },
    prepare({ headline, statusLabel }) {
      return {
        title: headline || "Hero Section",
        subtitle: statusLabel,
      };
    },
  },
});

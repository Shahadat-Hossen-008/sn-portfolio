import { defineField } from "sanity";

import { splitHeadline } from "@/sanity/lib/hero";

export const sectionHeaderFields = (options?: {
  headingMax?: number;
  introMax?: number;
  headingDescription?: string;
  introDescription?: string;
}) => {
  const headingMax = options?.headingMax ?? 70;
  const introMax = options?.introMax ?? 160;
  return [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description:
        "Small label above the heading, e.g. “How the work moves”. Any section number is added automatically, so don't type it. Max 40 characters.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description:
        options?.headingDescription ??
        `Main heading of the section, shown in the left column. Aim for two lines. Max ${headingMax} characters.`,
      validation: (rule) => rule.required().max(headingMax),
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
        options?.introDescription ??
        `One or two sentences under the heading. Max ${introMax} characters.`,
      validation: (rule) => rule.max(introMax),
    }),
  ];
};

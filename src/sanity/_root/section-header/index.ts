import { defineField } from "sanity";

import { splitHeadline } from "@/lib/hero";

export const sectionHeaderFields = (options?: {
  headingMax?: number;
  introMax?: number;
  headingDescription?: string;
  introDescription?: string;
  group?: string | string[];
}) => {
  const headingMax = options?.headingMax ?? 70;
  const group = options?.group;
  return [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      ...(group ? { group } : {}),
      description:
        "Small label above the heading, e.g. “How the work moves”. Max 40 characters.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      ...(group ? { group } : {}),
      description:
        options?.headingDescription ??
        `Main heading of the section, shown in the left column. Aim for two lines. Max ${headingMax} characters.`,
      validation: (rule) => rule.required().max(headingMax),
    }),
    defineField({
      name: "headingAccent",
      title: "Heading accent",
      type: "string",
      ...(group ? { group } : {}),
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
  ];
};

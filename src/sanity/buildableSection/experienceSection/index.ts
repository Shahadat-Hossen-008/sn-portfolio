import { BsBriefcase } from "react-icons/bs";
import { defineArrayMember, defineField, defineType } from "sanity";

import { countLabel, periodYears } from "@/sanity/lib/preview";

type RoleValue = { startDate?: string; current?: boolean };

export const experienceSection = defineType({
  name: "experienceSection",
  title: "Experience",
  type: "document",
  icon: BsBriefcase,
  description:
    "Your work history: role, company, dates, contribution, impact, and tools. Shown as a clean timeline beside the section eyebrow.",
  fields: [
    defineField({
      name: "title",
      title: "Section Reference Title (CMS only)",
      type: "string",
      description:
        "Optional internal title for this document in the Studio sidebar, e.g. “Professional Experience”.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow / Section Label",
      type: "string",
      initialValue: "EXPERIENCE",
      description: "The section tag on the left column, e.g. “EXPERIENCE”.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro (Optional)",
      type: "text",
      rows: 3,
      description:
        "Optional one or two sentences shown in the left column. Max 180 characters.",
      validation: (rule) => rule.max(180),
    }),
    defineField({
      name: "roles",
      title: "Roles",
      type: "array",
      description:
        "Up to five roles, newest first. Drag to reorder. Five keeps the page short and scannable.",
      validation: (rule) => rule.max(5),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "role",
              title: "Role",
              type: "string",
              description:
                "Your job title, shown large, e.g. “Frontend developer”. Max 40 characters so it stays on one or two lines.",
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: "company",
              title: "Company",
              type: "string",
              description:
                "Company or client name, shown under the role. Max 40 characters.",
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: "startDate",
              title: "Start date",
              type: "date",
              description:
                "When you started. Only the month and year are shown, so any day of the month works.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "current",
              title: "Current",
              type: "boolean",
              initialValue: false,
              description:
                "Turn on if you still work here. The end date is then hidden and the site shows “Present”.",
            }),
            defineField({
              name: "endDate",
              title: "End date",
              type: "date",
              description: "When you left. Hidden while Current is on.",
              hidden: ({ parent }) =>
                Boolean((parent as RoleValue | undefined)?.current),
              validation: (rule) =>
                rule.custom((value, context) => {
                  const role = context.parent as RoleValue | undefined;
                  if (role?.current) return true;
                  if (!value) return "Add an end date, or turn on Current.";
                  if (role?.startDate && value < role.startDate)
                    return "The end date can't be before the start date.";
                  return true;
                }),
            }),
            defineField({
              name: "description",
              title: "Role Context",
              type: "string",
              description:
                "One concise sentence describing the role, scope, or context. Max 160 characters.",
              validation: (rule) => rule.max(160),
            }),
            defineField({
              name: "contribution",
              title: "Contribution",
              type: "text",
              rows: 3,
              description:
                "What you personally built, improved, solved, or delivered. Focus on action and engineering approach. Max 240 characters.",
              validation: (rule) => rule.max(240),
            }),
            defineField({
              name: "impact",
              title: "Impact",
              type: "text",
              rows: 3,
              description:
                "Why that contribution mattered: what became better, faster, safer, clearer, or more maintainable. Max 240 characters.",
              validation: (rule) => rule.max(240),
            }),
            defineField({
              name: "featured",
              title: "Featured Role",
              type: "boolean",
              initialValue: false,
              description:
                "Emphasize this milestone with subtle visual priority for recruiters.",
            }),
            defineField({
              name: "project",
              title: "Related Project / Case Study",
              type: "reference",
              to: [{ type: "project" }],
              description:
                "Optional reference to a deep-dive case study or project.",
            }),
            defineField({
              name: "outcome",
              title: "Outcome (Legacy)",
              type: "text",
              rows: 3,
              description:
                "Legacy summary field preserved for backward compatibility. Use Contribution & Impact for new entries. Max 150 characters.",
              validation: (rule) => rule.max(150),
            }),
            defineField({
              name: "tools",
              title: "Tools",
              type: "array",
              description:
                "Technologies used in this role, shown as small tags. Pick from your technology tags so names stay consistent. Max 4, because the tags must fit on two lines.",
              validation: (rule) => rule.max(4).unique(),
              of: [
                defineArrayMember({
                  type: "reference",
                  to: [{ type: "techTag" }],
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "role",
              company: "company",
              startDate: "startDate",
              endDate: "endDate",
              current: "current",
            },
            prepare: ({ title, company, startDate, endDate, current }) => ({
              title: title || "Role",
              subtitle: [company, periodYears(startDate, endDate, current)]
                .filter(Boolean)
                .join(" · "),
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", eyebrow: "eyebrow", roles: "roles" },
    prepare: ({ title, eyebrow, roles }) => ({
      title: title || eyebrow || "Experience",
      subtitle: countLabel(roles?.length, "role"),
    }),
  },
});

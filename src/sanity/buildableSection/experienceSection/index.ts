import { BsBriefcase } from "react-icons/bs";
import { defineArrayMember, defineField, defineType } from "sanity";

import { sectionHeaderFields } from "@/sanity/_root/section-header";
import { countLabel, periodYears } from "@/sanity/lib/preview";

type RoleValue = { startDate?: string; current?: boolean };

export const experienceSection = defineType({
  name: "experienceSection",
  title: "Experience",
  type: "document",
  icon: BsBriefcase,
  description:
    "Your work history: role, company, dates, outcome and tools. Shown as a list on the right, beside a heading.",
  fields: [
    ...sectionHeaderFields({
      introMax: 180,
      introDescription:
        "One or two sentences under the heading, shown in the left column. Max 180 characters.",
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
              name: "outcome",
              title: "Outcome",
              type: "text",
              rows: 3,
              description:
                "One sentence about what you owned and the result. Max 150 characters so each role stays about the same height.",
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
    select: { title: "heading", roles: "roles" },
    prepare: ({ title, roles }) => ({
      title: title || "Experience",
      subtitle: countLabel(roles?.length, "role"),
    }),
  },
});

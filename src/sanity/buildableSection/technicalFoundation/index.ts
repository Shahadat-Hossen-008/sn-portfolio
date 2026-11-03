import { BsCpu } from "react-icons/bs";
import { defineArrayMember, defineField, defineType } from "sanity";

import { countLabel } from "@/sanity/lib/preview";

export const technicalFoundation = defineType({
  name: "technicalFoundation",
  title: "Technical Foundation",
  type: "document",
  icon: BsCpu,
  description:
    "Technical foundation showing your experience summary, engineering philosophy, and categorized tech stack columns (Frontend, Backend, CMS).",
  fields: [
    defineField({
      name: "title",
      title: "Section Reference Title (CMS only)",
      type: "string",
      description:
        "Optional internal title for this document in the Studio sidebar, e.g. “Core Technical Foundation”.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow / Section Label",
      type: "string",
      initialValue: "TECHNICAL FOUNDATION",
      description:
        "The section tag on the left column, e.g. “TECHNICAL FOUNDATION”.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "statement",
      title: "Lead Statement",
      type: "text",
      rows: 4,
      initialValue:
        "With over 6 years of professional experience, I've developed a deep understanding of the modern web ecosystem. I specialize in building scalable, type-safe applications that prioritize the end-user experience without compromising on developer productivity.",
      description:
        "Large editorial overview statement highlighting experience, architecture philosophy, and focus.",
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: "columns",
      title: "Technology Columns",
      type: "array",
      description:
        "The category columns (e.g. Frontend, Backend, CMS). Drag to reorder.",
      validation: (rule) => rule.max(4),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Category Title",
              type: "string",
              description:
                "Name of the category, e.g. “FRONTEND”, “BACKEND”, “CMS”.",
              validation: (rule) => rule.required().max(30),
            }),
            defineField({
              name: "skills",
              title: "Skills / Technologies",
              type: "array",
              description:
                "List of technologies in this column. Select from tech tags and optionally add specialization context.",
              validation: (rule) => rule.required().min(1),
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({
                      name: "tech",
                      title: "Technology Tag",
                      type: "reference",
                      to: [{ type: "techTag" }],
                      description: "Select a technology from your tech tags.",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "context",
                      title: "Specialization / Context (Optional)",
                      type: "string",
                      description:
                        "Optional specialization, e.g. “App Router”, “19 / RSC”, “Headless”, or “Supabase”.",
                      validation: (rule) => rule.max(30),
                    }),
                  ],
                  preview: {
                    select: {
                      title: "tech.label",
                      context: "context",
                      media: "tech.iconImage.imageFile",
                    },
                    prepare: ({ title, context, media }) => ({
                      title: title || "Technology",
                      subtitle: context ? `(${context})` : undefined,
                      media,
                    }),
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "title", skills: "skills" },
            prepare: ({ title, skills }) => ({
              title: title || "Category",
              subtitle: countLabel(skills?.length, "skill"),
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      eyebrow: "eyebrow",
      statement: "statement",
      columns: "columns",
    },
    prepare: ({ title, eyebrow, statement, columns }) => ({
      title: title || eyebrow || "Technical Foundation",
      subtitle: statement || countLabel(columns?.length, "column"),
    }),
  },
});

export default technicalFoundation;

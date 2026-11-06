import { LinkIcon, ProjectsIcon } from "@sanity/icons";
import { SiSanity } from "react-icons/si";
import { defineArrayMember, defineField, defineType } from "sanity";

import { formatDate } from "@/lib/formatDate";
import { link } from "@/sanity/_root/link";
import { seo, seoGroup } from "@/sanity/_root/seo";
import { slug } from "@/sanity/_root/seo/slug";

const STATUS_OPTIONS = [
  { title: "Shipped", value: "shipped" },
  { title: "In progress", value: "inProgress" },
];

export const projectTemplate = defineType({
  name: "project",
  type: "document",
  title: "Project",
  icon: ProjectsIcon,
  groups: [
    seoGroup,
    { name: "overview", title: "Overview", icon: SiSanity, default: true },
    { name: "summary", title: "Card summary" },
    { name: "story", title: "Case study" },
    { name: "timeline", title: "Timeline" },
    { name: "links", title: "Links" },
  ],
  fieldsets: [
    {
      name: "projectDuration",
      title: "Project duration",
      options: { columns: 2 },
    },
  ],
  fields: [
    // SEO only. The top level `slug` below drives `/projects/[slug]`.
    seo({ group: "seo", includeSlug: false, optional: true }),

    defineField({
      name: "projectTitle",
      title: "Project title",
      type: "string",
      group: "overview",
      validation: (rule) => rule.required().error("Please provide the title."),
    }),
    {
      ...slug({ source: "projectTitle", isFixed: false, prefix: "projects" }),
      group: "overview",
    },
    defineField({
      name: "projectType",
      title: "Project type",
      type: "string",
      group: "overview",
      description: "Card label, e.g. “Web app”. Max 40 characters.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "overview",
      options: { list: STATUS_OPTIONS, layout: "radio" },
      initialValue: "shipped",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      group: "overview",
      description: "Your role. Max 100 characters.",
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: "client",
      title: "Client / Organization (Optional)",
      type: "string",
      group: "overview",
      description:
        "e.g. Acme Corp or Open Source. Shown in the project details ribbon.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "duration",
      title: "Duration (Optional)",
      type: "string",
      group: "timeline",
      description:
        "e.g. “6 Months” or “Q1 2024”. If empty, dates from the timeline will be used.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "projectImage",
      title: "Project image",
      type: "customImage",
      group: "overview",
      validation: (rule) =>
        rule.required().error("A card image is required for the showcase."),
    }),
    defineField({
      name: "stack",
      title: "Stack",
      type: "array",
      group: "overview",
      description: "Technologies used, picked from your technology tags.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "techTag" }] })],
      validation: (rule) => rule.unique().max(8),
    }),
    defineField({
      name: "date",
      title: "Posted date",
      type: "datetime",
      group: "overview",
      description: "Orders the showcase and the home page work tile.",
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: "projectDescription",
      title: "Description",
      type: "text",
      rows: 4,
      group: "summary",
      description:
        "The 3–4 line summary on the showcase card. Max 300 characters.",
      validation: (rule) => rule.max(300),
    }),

    defineField({
      name: "caseStudy",
      title: "Case Study",
      type: "portableText",
      group: "story",
      description:
        "Detail page version: context, constraints, approach & outcome. Lists and images allowed.",
    }),

    defineField({
      name: "start",
      title: "Start",
      type: "datetime",
      group: "timeline",
      fieldset: "projectDuration",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "end",
      title: "End",
      type: "datetime",
      group: "timeline",
      fieldset: "projectDuration",
      description: "Hidden while the status is In progress.",
      hidden: ({ document }) => document?.status === "inProgress",
      validation: (rule) =>
        rule.custom((value, context) => {
          const status = context.document?.status;
          const start = context.document?.start;

          if (status === "inProgress") return true;
          if (!value)
            return "End date is required when the project is shipped.";
          if (start && new Date(value) <= new Date(start as string)) {
            return "End date must be after the start date.";
          }

          return true;
        }),
    }),

    {
      ...link("caseStudyLink"),
      title: "Case study Link",
      icon: LinkIcon,
      group: "links",
      description: "Optional. Leave empty when the project has no write-up.",
    },
    defineField({
      name: "liveLink",
      title: "Live link",
      type: "url",
      group: "links",
      description: "The deployed project (https only).",
      validation: (rule) =>
        rule
          .uri({ scheme: ["https"] })
          .error("Please provide a valid live URL."),
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
      group: "links",
      description: "The repository (https only). Optional for private work.",
      validation: (rule) =>
        rule
          .uri({ scheme: ["https"] })
          .error("Please provide a valid GitHub URL."),
    }),
  ],
  preview: {
    select: {
      title: "projectTitle",
      date: "date",
      status: "status",
      media: "projectImage.imageFile",
    },
    prepare({ title, date, status, media }) {
      const posted = formatDate(date);
      const label = STATUS_OPTIONS.find((option) => option.value === status);
      return {
        title,
        media,
        subtitle: [label?.title, posted && `Posted ${posted}`]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});

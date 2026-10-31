import { defineArrayMember, defineField, defineType } from "sanity";
import { seo, seoGroup } from "@/sanity/_root/seo";
import { SiSanity } from "react-icons/si";
import { IoDocument } from "react-icons/io5";

export const project = defineType({
  name: "projectPage",
  type: "document",
  title: "Project Page",
  icon: IoDocument,
  groups: [
    seoGroup,
    {
      name: "content",
      title: "Content",
      icon: SiSanity,
      default: true,
    },
  ],
  fields: [
    seo({ group: "seo", slugOptions: { isFixed: true, prefix: "projects" } }),
    defineField({
      name: "pageIntro",
      title: "Page Intro",
      type: "pageIntroSection",
      group: "content",
    }),
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      description:
        "The projects shown on the showcase, in order. Drag to reorder. Leave empty to show every project automatically.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "project" }],
        }),
      ],
      validation: (rule) => rule.unique(),
      group: "content",
    }),
    defineField({
      name: "pageSections",
      title: "Page Sections",
      type: "pageSections",
      group: "content",
    }),
  ],
  preview: {
    select: {
      title: "seo.title",
    },
    prepare({ title }) {
      return {
        title: title,
        subtitle: "Project Page",
      };
    },
  },
});

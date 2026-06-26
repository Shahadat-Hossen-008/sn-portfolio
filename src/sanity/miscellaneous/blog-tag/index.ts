import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const blogTag = defineType({
  name: "blogTag",
  title: "Blog Tag",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Blog Tag Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});

import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const tagType = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      description: "Upload the icon image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: "label",
      media: "icon",
    },
  },
});

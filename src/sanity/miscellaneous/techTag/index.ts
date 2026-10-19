import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const techTag = defineType({
  name: "techTag",
  title: "Tech Tag",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "iconImage",
      type: "customImage",
      title: "Icon Image",
    }),
  ],
  preview: {
    select: {
      title: "label",
      media: "iconImage.imageFile",
    },
  },
});

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

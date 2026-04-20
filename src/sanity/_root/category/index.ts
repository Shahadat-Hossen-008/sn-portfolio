import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "object",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Category Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "customImage",
      description:
        "Upload the icon image if you want to use an icon for this category",
    }),
    defineField({
        name:"link",
        title:"Link",
        type:"link"
    })
  ],
  preview: {
    select: {
      title: "title",
      media: "icon.imageFile",
    },
  },
});

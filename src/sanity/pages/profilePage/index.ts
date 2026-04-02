import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const profile = defineType({
  name: "profilePage",
  title: "Profile Page",
  type: "document",
  icon: "UserIcon",
  fields: [
    defineField({
      name: "autherInfo",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [{ type: "block" }],
      description: "Write a few sentences about yourself",
    }),
    defineField({
      name: "authorImage",
      title: "Author Image",
      description: "Upload your profile picture",
      type: "customImage",
    }),
    defineField({
      name: "imagePosition",
      title: "Image Position",
      type: "string",
      initialValue: "right",
      options: {
        list: [
          { value: "left", title: "Left" },
          { value: "right", title: "Right" },
        ],
        layout: "radio",
      },
    }),
    defineField({
        name: "technologies",
        title: "Technologies",
        type: "array",
        of: [{ type: "category" }],

    }),
    defineField({
      name: "uploadCV",
      title: "Upload CV",
      description: "Upload your CV (PDF only)",
      type: "file",
      options: {
        accept: "application/pdf",
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "autherInfo.fullName",
      media: "image.imageFile",
    },
  },
});

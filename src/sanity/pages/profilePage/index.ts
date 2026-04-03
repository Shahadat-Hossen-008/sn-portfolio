
import { BsPersonFill } from "react-icons/bs";
import { defineField, defineType } from "sanity";

export const profile = defineType({
  name: "profilePage",
  title: "Profile Page",
  type: "document",
  icon: BsPersonFill,
  fields: [
    defineField({
      name: "autherInfo",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name:"pageSections",
      title:"Page Sections",
      type: "pageSections"
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

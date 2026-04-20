
import { seo, seoGroup } from "@/sanity/_root/seo";
import { BsPersonFill } from "react-icons/bs";
import { SiSanity } from "react-icons/si";
import { defineField, defineType } from "sanity";

export const profile = defineType({
  name: "myProfilePage",
  title: "Profile Page",
  type: "document",
  icon: BsPersonFill,
  groups:[
    seoGroup,
    {
      name:"content",
      title:"Content",
      icon: SiSanity,
      default: true
    }
  ],
  fields: [
    seo({group:"seo", slugOptions:{isFixed: true}}),
    defineField({
      name: "autherInfo",
      type: "reference",
      to: [{ type: "author" }],
      group:"content"
    }),
    defineField({
      name:"pageSections",
      title:"Page Sections",
      type: "pageSections",
      group:"content"
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
      group:"content"
    }),
  ],
  preview: {
    select: {
      title: "autherInfo.fullName",
      media: "image.imageFile",
    },
  },
});

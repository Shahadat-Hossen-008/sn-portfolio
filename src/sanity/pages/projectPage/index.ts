import { defineField, defineType } from "sanity";
import { toPlainText } from "@portabletext/react";
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
      default: true
    }
  ],
  fields: [
     seo({group:"seo", slugOptions:{isFixed: true, prefix:"project"}}),
     defineField({
      name: "projects",
      title: "Projects",
      type:"array",
      of:[{type:"reference", to:[{type:"project"}]}],
      group:"content"
     })
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

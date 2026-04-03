import { defineField, defineType } from "sanity";
import { toPlainText } from "@portabletext/react";
import { LinkIcon, ProjectsIcon } from "@sanity/icons";

export const projectSection = defineType({
  name: "project",
  type: "object",
  title: "Projects",
  icon: ProjectsIcon,
  fields: [
    defineField({
      name: "projectTitle",
      title: "Project Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "projectDescription",
      title: "Project Description",
      type: "portableText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "customImage",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "projectLink",
      title: "Project Link",
      icon: LinkIcon,
      type: "link",
      validation: (rule) => rule.required(),
      options:{
        enableText: true
      }
    }),
  ],
  preview: {
    select: {
      content: "content",
      image: "image",
    },
    prepare({ content, image }) {
      const plainText = toPlainText(content)
        .substring(0, 40)
        .replace(/[.,]+$/g, "");
      

      return {
        title: plainText ? plainText + "..." : undefined,
        subtitle: "Rich Text Section",
        // icon: BsFileRichtextFill,
        media: image.imageFile,
      };
    },
  },
});

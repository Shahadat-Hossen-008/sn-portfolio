import { defineField, defineType } from "sanity";
import {  BsFileEarmarkText } from "react-icons/bs";
import { toPlainText } from "@portabletext/react";

export default defineType({
  name: "profileContent",
  type: "object",
  title: "Profile Content",
  icon: BsFileEarmarkText,
  fields: [
    defineField({
      name: "content",
      title: "Content",
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
      name: "imagePosition",
      title: "Image Position",
      type: "string",
      options: {
        list: [
          { value: "left", title: "Left" },
          { value: "right", title: "Right" },
        ],
        layout: "radio",
      },
      
    }),
  ],
  initialValue:{
    imagePosition:"right"
  },
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

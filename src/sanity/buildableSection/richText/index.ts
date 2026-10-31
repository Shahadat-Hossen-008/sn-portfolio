import { defineField, defineType } from "sanity";
import { BsFileRichtextFill } from "react-icons/bs";
import { toPlainText } from "@portabletext/react";

export default defineType({
  name: "richTextSection",
  type: "document",
  title: "Rich Text Section",
  icon: BsFileRichtextFill,
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "portableText",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      content: "content",
    },
    prepare({ content }) {
      const plainText = content
        ? toPlainText(content).substring(0, 40).replace(/[.,]+$/g, "")
        : "";

      return {
        title: plainText ? `${plainText}...` : "Rich Text Section",
        subtitle: "Rich Text Section",
        media: BsFileRichtextFill,
      };
    },
  },
});

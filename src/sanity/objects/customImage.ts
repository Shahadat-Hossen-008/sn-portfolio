import { ImageIcon } from "@sanity/icons";
import { defineField } from "sanity";

export const customImage = defineField({
  name: "customImage",
  title: "Custom Image",
  icon: ImageIcon,
  type: "object",
  fields: [
    defineField({
      type: "image",
      name: "imageFile",
      options: { hotspot: true },
    }),
    defineField({
      type: "string",
      name: "altText",
      title: "Alternative Text",
      validation: (rule) =>
        rule
          .required()
          .warning("Alternative text is recommended for accessibility"),
    }),
    defineField({
      type: "boolean",
      name: "isClickable",
      title: "Is Clickable?",
      initialValue: false,
    }),
    defineField({
      type: "url",
      name: "linkUrl",
      title: "Link URL",
      hidden: ({ parent }) => !parent?.isClickable,
    }),
  ],
});

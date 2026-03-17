import { ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { customImageProps } from "./types/customImage";

export const customImage = ({
  name,
  title,
  isClickable = false,
}: customImageProps) =>
  defineType({
    name,
    type: "image",
    title: title || "Image",
    icon: ImageIcon,
    options: {
      hotspot: true,
    },

    fields: [
      defineField({
        name: "alt",
        title: "Alt Text",
        type: "string",
        description: "For accessibility, screen readers, SEO",
        validation: (Rule) =>
          Rule.required().warning("Alt text is required for accessibility"),
      }),
      defineField({
        name: "link",
        title: "Link",
        type: "url",
        description: " Makes the image clickable",
        hidden: !isClickable,
        validation: (Rule) =>
          Rule.uri({
            scheme: ["https"],
          }).warning("Please enter a valid URL starting with https://"),
      }),
    ],
  });

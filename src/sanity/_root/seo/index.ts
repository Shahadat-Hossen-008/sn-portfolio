// sanity/_root/seo.ts
import { defineField, defineType, StringRule } from "sanity";
import { FaGlobe } from "react-icons/fa";

interface SeoArgs {
  group?: string;
}

export const seo = ({ group }: SeoArgs = {}) =>
  defineField({
    name: "seo",
    title: "SEO",
    type: "object",

    group: group || "seoGroup.name",
    fields: [
      defineField({
        name: "title",
        title: "Title",
        type: "string",
        validation: (rule: StringRule) =>
          rule
            .required()
            .max(60)
            .warning(
              "It is recommended keep the main title between 30 and 50 characters."
            ),
      }),
     defineField({
        name: "slug",
        type: "slug",
        title: "Slug",
        options: { source:"seo.title" }
  }),
      defineField({
        name: "description",
        title: "Description",
        type: "text",
        rows: 3,
        validation: (rule: StringRule) =>
          rule
            .required()
            .max(160)
            .warning(
              "It is recommended to keep the main description below 160 characters."
            ),
      }),
    ],
  });

  export const seoGroup = {
  name: "seo",
  title: "SEO",
  icon: FaGlobe,
};
// sanity/_root/seo.ts
import { defineField, ObjectRule, StringRule } from "sanity";
import { FaGlobe } from "react-icons/fa";
import { ISanitySlugOptions } from "./slug/interface";
import { slug } from "./slug";

export interface SeoArgs {
  slugOptions: ISanitySlugOptions;
  group?: string;
}

export const seo = (args: SeoArgs) =>
  defineField({
    name: "seo",
    title: "SEO",
    type: "object",

    group: args.group || seoGroup.name,
    fields: [
      defineField({
        name: "title",
        title: "Title",
        type: "string",
        validation: (rule: StringRule) => [
          rule.required().error("Required"),
          rule
            .max(60)
            .warning(
              "It is recommended keep the main title between 30 and 50 characters."
            ),
        ],
      }),
      slug({
        source: args.slugOptions?.source || "seo.title",
        isFixed: args.slugOptions?.isFixed || false,
        prefix: args.slugOptions?.prefix || "",
      }),
      defineField({
        name: "description",
        title: "Description",
        type: "text",
        rows: 3,
        validation: (rule: StringRule) => [
          rule
            .required()
            .warning("Please provide a description to improve SEO scores."),
          rule
            .max(160)
            .warning(
              "It is recommended to keep the main description below 160 characters."
            ),
        ],
      }),
    ],
    validation: (rule: ObjectRule) => rule.required(),
  });

export const seoGroup = {
  name: "seo",
  title: "SEO",
  icon: FaGlobe,
};

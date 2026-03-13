import { defineField, defineType } from "sanity";

export const about = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "Title of the about page",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContentText",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "socialLinks",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "icon", type: "image", description: "Upload the icon image", options:{hotspot: true} },
            { name: "url", type: "url" },
          ],
        },
      ],
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      description: "Define the technologies used in the project",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
  ],
});

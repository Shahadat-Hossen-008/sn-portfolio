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
            {
              name: "icon",
              type: "customImage",
            },
            { name: "url", type: "url" },
          ],
          preview: {
            select: {
              title: "label",
              media: "icon.imageFile",
            },
          },
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

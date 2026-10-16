import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "blogTitle",
      title: "Blog Title",
      type: "string",
      validation: (Rule) =>
        Rule.required().error(
          "Blog title is required to generate a page on the website",
        ),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "blogTitle" },
      validation: (Rule) =>
        Rule.required().error("slug is required generate a page on the website"),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
    defineField({
      name: "mainImage",
      title: "Blog Image",
      type: "customImage",
    }),
    defineField({
      name: "blogContent",
      title: "Blog Content",
      type: "portableText",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "blogTag" }] }],
    }),
  ],
  preview: {
    select: {
      title: "blogTitle",
      author: "author",
      media: "mainImage.imageFile",
    },
    prepare({ title, media, author }) {
      return { title, media, subtitle: author && `by ${author}` };
    },
  },
});
import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const blogType = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  icon: DocumentIcon,
  fields:[
    defineField({
      name: "blogTitle",
      title: "Blog Title",
      type: "string",
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'blogTitle'},
      validation: (Rule) => Rule.required().error('slug is required generate a page on the website'),
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
      name: 'mainImage',
      title: 'Blog Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: rule => rule.custom((value, context) => {
              
            const parent = context?.parent as {asset?: {_ref?: string}}
            return !value && parent?.asset?._ref ? 'Alt text is required when an image is present' : true
          }),
        })
      ]
    }),
    defineField({
        name: "blogContent",
        title: "Blog Content",
        type: "blockContent"
    }),
    defineField({
      name: "categories",
      title: "Categories",
      description: "What categories does this blog post belong to?",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: {
      title: 'blogTitle',
      author: 'author',
      media: 'mainImage',
    },
    prepare({title, media, author}) {
      return {title, media, subtitle: author && `by ${author}`}
    },
  },
})
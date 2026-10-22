import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { SiSanity } from "react-icons/si";

import { seo, seoGroup } from "@/sanity/_root/seo";

export default defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  icon: DocumentIcon,
  groups: [
    seoGroup,
    {
      name: "content",
      title: "Content",
      icon: SiSanity,
      default: true,
    },
  ],
  fields: [
    /**
     * Per-article SEO. `includeSlug: false` because `blogPost` already owns a
     * top level `slug` that drives `/blog/[slug]` — a second slug here would be
     * a second source of truth for the same URL.
     */
    seo({ group: "seo", includeSlug: false, optional: true }),
    defineField({
      name: "blogTitle",
      title: "Blog Title",
      type: "string",
      group: "content",
      validation: (Rule) =>
        Rule.required().error(
          "Blog title is required to generate a page on the website",
        ),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "blogTitle" },
      validation: (Rule) =>
        Rule.required().error("slug is required generate a page on the website"),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "content",
    }),
    defineField({
      name: "mainImage",
      title: "Blog Image",
      type: "customImage",
      group: "content",
    }),
    defineField({
      name: "blogContent",
      title: "Blog Content",
      type: "portableText",
      group: "content",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "blogTag" }] }],
      group: "content",
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
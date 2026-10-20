import { seo, seoGroup } from "@/sanity/_root/seo";
import { defineArrayMember, defineField, defineType } from "sanity";
import { SiSanity } from "react-icons/si";
import { FaBlog } from "react-icons/fa";

export const blog = defineType({
  name: "blogPage",
  title: "Blog Page",
  type: "document",
  icon: FaBlog,
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
    seo({ group: "seo", slugOptions: { isFixed: true, prefix: "blog" } }),
    defineField({
      name: "blogPosts",
      title: "Blog Posts",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "blogPost" }],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "seo.title",
    },
    prepare({ title }) {
      return {
        title,
        subtitle: "Blog Page",
      };
    },
  },
});

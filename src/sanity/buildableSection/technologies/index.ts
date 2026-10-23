import { TagIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "technologySection",
  type: "document",
  title: "Technologies",
  icon: TagIcon,
  fields: [
    defineField({
      name: "technology",
      title: "Technology",
      type: "array",
      of: [defineArrayMember({ type: "technologyItem" })],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      technology: "technology",
    },
    prepare({ technology }) {
      const count = Array.isArray(technology) ? technology.length : 0;
      return {
        title: "Technologies",
        subtitle: `${count} item${count === 1 ? "" : "s"}`,
        media: TagIcon,
      };
    },
  },
});

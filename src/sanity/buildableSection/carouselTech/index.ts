import { defineArrayMember, defineField, defineType } from "sanity";
import { MdViewCarousel } from "react-icons/md";

export default defineType({
  name: "technologyCarousel",
  title: "Technology Carousel",
  type: "document",
  icon: MdViewCarousel,
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
        title: "Technology Carousel",
        subtitle: `${count} item${count === 1 ? "" : "s"}`,
        media: MdViewCarousel,
      };
    },
  },
});

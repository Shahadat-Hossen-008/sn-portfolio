
import { defineField, defineType } from "sanity";
import { MdViewCarousel } from "react-icons/md";

export default defineType({
  name: "technologyCarousel",
  title: "Technology Carousel",
  type: "object",
  icon: MdViewCarousel,
  fields: [
    defineField({
      name: "technology",
      title: "Technology",
      type: "array",
      of: [ {type: "category"}],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "technology",
    },
  },
  
});
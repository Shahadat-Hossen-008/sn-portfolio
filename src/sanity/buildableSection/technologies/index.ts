import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "technologySection",
  type: "object",
  title: "Technologies",
  icon: TagIcon,
  fields: [
    defineField({
      name: "technology",
      title: "Technology",
      type: "array",
      of: [ {type: "category"}],
      validation: (rule) => rule.required(),
    }),
  ],
  
});
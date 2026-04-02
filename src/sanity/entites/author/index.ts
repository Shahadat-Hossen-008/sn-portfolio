import { StringRule, defineField, defineType } from "sanity";
import { BsPersonFill } from "react-icons/bs";

export default defineType({
  name: "author",
  type: "document",
  title: "Author",
  icon: BsPersonFill,
  fields: [
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      description:
        "The fullname of the person.",
      validation: (rule: StringRule) =>
        rule.required().error("Please provide the fullname."),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description:
        "A short description of the author to be used in author role.",
      validation: (rule: StringRule) =>
        rule.required().error("Please provide a short description."),
    }),
  ],
  preview: {
    select: {
      fullName: "fullName",
    },
    prepare({ fullName }) {
      return {
        title: fullName,
        media: BsPersonFill,
        subtitle: "Author",
      };
    },
  },
});

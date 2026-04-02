import { defineArrayMember, defineField } from "sanity";
import { block } from "./block";
import { youtube } from "./iframe";

export default defineField({
  name: "portableText",
  type: "array",
  title: "Portable Text",
  of: [
    defineArrayMember(block),
    defineArrayMember({
      name: "portableTextImage",
      type: "customImage",
      title: "Image",
    }),
    defineArrayMember(youtube),
  ],
});

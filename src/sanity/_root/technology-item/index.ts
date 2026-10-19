import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { link } from "@/sanity/_root/link";

/**
 * An inline technology entry inside a page-builder technology block
 * (`technologySection` / `technologyCarousel`).
 *
 * This is deliberately an OBJECT, not a document: it only ever exists inside
 * a `pageSections` array. It was previously named `category`, which collided
 * with the legacy `category` *documents* (blog topics, now `blogTag`) and with
 * the `project.stack` reference field — the collision is what hid the fact
 * that `project.stack` pointed at an object type.
 *
 * Technology *documents* (referenced by `project.stack` and the homepage
 * carousel) are `techTag`. Do not point a `reference` at this type.
 */
export const technologyItem = defineType({
  name: "technologyItem",
  title: "Technology",
  type: "object",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Technology Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "customImage",
      description:
        "Upload the icon image if you want to use an icon for this technology",
    }),
    link(),
  ],
  preview: {
    select: {
      title: "title",
      media: "icon.imageFile",
    },
  },
});

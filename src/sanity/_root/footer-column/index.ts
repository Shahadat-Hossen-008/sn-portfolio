import { ThLargeIcon } from "@sanity/icons";
import { defineArrayMember } from "sanity";

/**
 * One column of the site-wide footer. Every column is a heading plus an
 * ordered list of `navLink` members, so the footer reuses the exact same link
 * contract (and the exact same `resolveNavHref` helper) as the header.
 */
export const footerColumnMember = defineArrayMember({
  name: "footerColumn",
  title: "Column",
  icon: ThLargeIcon,
  type: "object",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().error("A column title is required."),
    },
    {
      name: "links",
      title: "Links",
      type: "array",
      of: [{ type: "navLink" }],
      validation: (rule) =>
        rule.min(1).warning("An empty column renders nothing useful."),
    },
  ],
  preview: {
    select: { title: "title", links: "links" },
    prepare({ title, links }: { title?: string; links?: unknown[] }) {
      return {
        title: title ?? "Untitled column",
        subtitle: `${links?.length ?? 0} link${links?.length === 1 ? "" : "s"}`,
        media: ThLargeIcon,
      };
    },
  },
});
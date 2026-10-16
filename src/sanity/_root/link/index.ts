import { EarthGlobeIcon, LinkIcon, PinIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import {
  HOMEPAGE_SECTIONS,
  INTERNAL_REFERENCE_TYPES,
} from "@/sanity/lib/routes";

/**
 * The three kinds of link a navigation entry can be.
 *
 * `anchor` exists because the homepage is a single scrolling document whose
 * sections (`#about`, `#projects`, `#contact`) are not addressable Sanity
 * documents — see `anchorHref` in `@/sanity/lib/routes`.
 */
export const LINK_TYPES = ["internal", "external", "anchor"] as const;

export type LinkType = (typeof LINK_TYPES)[number];

export const LINK_TYPE_LABELS: Record<LinkType, string> = {
  internal: "Internal page",
  external: "External URL",
  anchor: "Homepage anchor",
};

/**
 * Registered object type named `link`. The stable `name` preserves the
 * `_type: "link"` contract for existing link objects in the dataset, so this
 * type can replace `sanity-plugin-link-field` without a data migration for
 * object-shaped links.
 *
 * Registered once (in `schemaTypes.hoistedObjects`) and reused everywhere a
 * link appears: header nav links, footer columns, header CTA,
 * `project.projectLink`, `technologyItem.link`, and the Portable Text link
 * annotation.
 */
export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required().error("A label is required."),
    }),
    defineField({
      name: "type",
      title: "Link type",
      type: "string",
      options: {
        list: [...LINK_TYPES],
        layout: "radio",
      },
      initialValue: "external",
      validation: (rule) => rule.required().error("Pick a link type."),
    }),
    defineField({
      name: "reference",
      title: "Page",
      type: "reference",
      /**
       * Derived from `ROUTES_BY_TYPE`, so the Studio can never offer a document
       * the frontend has no route for.
       */
      to: INTERNAL_REFERENCE_TYPES.map((type) => ({ type })),
      options: { disableNew: true },
      hidden: ({ parent }) => (parent as { type?: string })?.type !== "internal",
      validation: (rule) =>
        rule.custom((value, context) => {
          const type = (context.parent as { type?: string })?.type;
          if (type !== "internal") return true;
          return value ? true : "Choose the page this link should open.";
        }),
    }),
    defineField({
      name: "url",
      title: "URL",
      /**
       * A plain `string`, not Sanity's `url` type: the same field holds an
       * external URL for the `external` type and a `#fragment` for the `anchor`
       * type, and the `url` type rejects bare fragments.
       */
      type: "string",
      description:
        "Absolute `https://` URL (or `mailto:` / `tel:`), or a fragment such as `#about` for a homepage section.",
      hidden: ({ parent }) => (parent as { type?: string })?.type === "internal",
      validation: (rule) =>
        rule.custom((value, context) => {
          const type = (context.parent as { type?: string })?.type;
          const trimmed = typeof value === "string" ? value.trim() : "";

          if (type === "internal") return true;

          if (!trimmed) {
            if (type === "external") return "An external link needs a URL.";
            if (type === "anchor")
              return "An anchor link needs a fragment, for example `#about`.";
            return true;
          }

          if (type === "external") {
            return /^(https?:\/\/|mailto:|tel:)/i.test(trimmed)
              ? true
              : "Use an https://, mailto: or tel: URL.";
          }

          if (type === "anchor") {
            const fragment = trimmed.replace(/^\/?#/, "");

            return HOMEPAGE_SECTIONS.includes(
              fragment as (typeof HOMEPAGE_SECTIONS)[number],
            )
              ? true
              : `Choose one of: ${HOMEPAGE_SECTIONS.join(", ")}.`;
          }

          return true;
        }),
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in a new tab",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isDisabled",
      title: "Disabled",
      description:
        "Renders the entry as plain text. Useful for shipping a nav item before the page exists.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "type" },
    prepare({ title, subtitle }) {
      const icon =
        subtitle === "internal"
          ? PinIcon
          : subtitle === "external"
            ? EarthGlobeIcon
            : LinkIcon;

      return {
        title: title ?? "Untitled link",
        subtitle: LINK_TYPE_LABELS[subtitle as LinkType] ?? subtitle,
        media: icon,
      };
    },
  },
});

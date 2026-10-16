import { EarthGlobeIcon, LinkIcon, PinIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { INTERNAL_REFERENCE_TYPES } from "@/sanity/lib/routes";

/**
 * The three kinds of link a navigation entry can be.
 *
 * `anchor` exists because the homepage is a single scrolling document whose
 * sections (`#about`, `#projects`, `#contact`) are not addressable Sanity
 * documents — see `anchorHref` in `@/sanity/lib/routes`.
 */
export const NAV_LINK_TYPES = ["internal", "external", "anchor"] as const;

export type NavLinkType = (typeof NAV_LINK_TYPES)[number];

export const NAV_LINK_TYPE_LABELS: Record<NavLinkType, string> = {
  internal: "Internal page",
  external: "External URL",
  anchor: "Homepage anchor",
};

/**
 * Registered as a top-level object type so the same definition can be used as
 * an array member (`of: [{ type: "navLink" }]`) and as a single object
 * (`header.cta`) — one schema, one validation contract, everywhere a link
 * appears.
 */
export const navLink = defineType({
  name: "navLink",
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
        list: [...NAV_LINK_TYPES],
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
       * the frontend has no route for. Adding a route in `@/sanity/lib/routes`
       * is therefore all it takes to make a document linkable.
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
      type: "url",
      description:
        "Absolute URL, or a fragment such as `#about` for a homepage section.",
      hidden: ({ parent }) => (parent as { type?: string })?.type === "internal",
      validation: (rule) =>
        rule.custom((value, context) => {
          const type = (context.parent as { type?: string })?.type;

          if (type === "internal") return true;
          if (type === "external" && !value)
            return "An external link needs a URL.";
          if (type === "anchor" && !value)
            return "An anchor link needs a fragment, for example `#about`.";

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
        subtitle: NAV_LINK_TYPE_LABELS[subtitle as NavLinkType] ?? subtitle,
        media: icon,
      };
    },
  },
});
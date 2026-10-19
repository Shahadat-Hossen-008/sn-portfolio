import { EarthGlobeIcon, LinkIcon, PinIcon } from "@sanity/icons";
import { defineField } from "sanity";

import { INTERNAL_REFERENCE_TYPES } from "@/sanity/lib/routes";
import {
  LINK_TYPES,
  LINK_TYPE_LABELS,
  type LinkType,
} from "@/sanity/lib/links";


export { LINK_TYPES, LINK_TYPE_LABELS } from "@/sanity/lib/links";

/** Creates an inline link field using the shared link behavior and validation. */
export const link = (name = "link") => {
  return defineField({
    name,
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
         * A plain `string`, not Sanity's `url` type, so `mailto:` and `tel:` remain
         * valid alongside web URLs.
         */
        type: "string",
        description: "External URL using `https://`, `mailto:` or `tel:`.",
        hidden: ({ parent }) => (parent as { type?: string })?.type === "internal",
        validation: (rule) =>
          rule.custom((value, context) => {
            const type = (context.parent as { type?: string })?.type;
            const trimmed = typeof value === "string" ? value.trim() : "";

            if (type === "internal") return true;

            if (!trimmed) {
              if (type === "external") return "An external link needs a URL.";
              return true;
            }

            if (type === "external") {
              return /^(https?:\/\/|mailto:|tel:)/i.test(trimmed)
                ? true
                : "Use an https://, mailto: or tel: URL.";
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
        const icon = subtitle === "internal" ? PinIcon : EarthGlobeIcon;

        return {
          title: title ?? "Untitled link",
          subtitle: LINK_TYPE_LABELS[subtitle as LinkType] ?? subtitle,
          media: icon,
        };
      },
    },
  });
};

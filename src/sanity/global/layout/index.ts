import { FiSettings } from "react-icons/fi";
import {
  defineField,
  defineType,
  type DocumentDefinition,
} from "sanity";
import { FaBars, FaLayerGroup, FaUserCircle } from "react-icons/fa";
import { link } from "@/sanity/_root/link";

export const LAYOUT_TYPE = "layout";

/**
 * Site-wide layout singleton.
 *
 * Owns the editable site identity and chrome (header / footer / social links).
 * Page-level metadata (title / description / slug / open graph / robots /
 * redirect) lives on each page's own `seo()` object; site-wide defaults live on
 * `siteSettings`.
 *
 * The document `_id` is pinned to the schema type name by
 * `createSingleDocumentStructure` in `src/sanity/structure`, which is what
 * makes `*[_type == "layout"][0]` safe in GROQ.
 */
export const layout: DocumentDefinition = defineType({
  name: LAYOUT_TYPE,
  title: "Layout",
  type: "document",
  icon: FiSettings,
  groups: [
    { name: "identity", title: "Identity", icon: FaUserCircle },
    { name: "header", title: "Header", icon: FaBars },
    { name: "footer", title: "Footer", icon: FaLayerGroup },
  ],
  fields: [
    /* ------------------------------------------------------------------ */
    /* Identity                                                            */
    /* ------------------------------------------------------------------ */
    defineField({
      name: "identity",
      title: "Identity",
      type: "object",
      group: "identity",
      options: { collapsed: false },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "siteTitle",
          title: "Site title",
          type: "string",
          description:
            "Used as the `<title>` fallback and by the `titleTemplate` below.",
          validation: (rule) => rule.required().error("Required."),
        }),
        defineField({
          name: "siteDescription",
          title: "Site description",
          type: "text",
          rows: 3,
          description: "Fallback meta description for pages without one.",
          validation: (rule) =>
            rule
              .max(160)
              .warning("Keep the description below 160 characters."),
        }),
        defineField({
          name: "logo",
          title: "Logo",
          type: "customImage",
          description:
            "Rendered in the header and footer. Its `altText` becomes the logo alt.",
        }),
        defineField({
          name: "favicon",
          title: "Favicon",
          type: "image",
          description:
            "Optional square asset for the browser tab. Falls back to the logo when empty.",
          options: { hotspot: true },
        }),
        defineField({
          name: "socialLinks",
          title: "Social links",
          description: "Shared by the header and the footer.",
          type: "array",
          of: [
            {
              name: "socialLink",
              title: "Social link",
              type: "object",
              fields: [
                defineField({
                  name: "network",
                  title: "Network",
                  type: "string",
                  options: {
                    list: [
                      { title: "GitHub", value: "github" },
                      { title: "LinkedIn", value: "linkedin" },
                      { title: "X", value: "x" },
                      { title: "Instagram", value: "instagram" },
                      { title: "Facebook", value: "facebook" },
                      { title: "YouTube", value: "youtube" },
                      { title: "Dribbble", value: "dribbble" },
                      { title: "Behance", value: "behance" },
                      { title: "Email", value: "email" },
                      { title: "Other", value: "other" },
                    ],
                    layout: "dropdown",
                  },
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                  description:
                    "Accessible name and fallback text. Leave empty to derive it from the network.",
                  validation: (rule) =>
                    rule.max(40).warning("Keep it short — it renders as a label."),
                }),
                defineField({
                  name: "url",
                  title: "URL",
                  type: "string",
                  description:
                    "Absolute URL, or `mailto:` / `tel:`. Prefixed with `https://` when no protocol is given.",
                  validation: (rule) => rule.required().error("Required."),
                }),
              ],
              preview: {
                select: { title: "network", subtitle: "url" },
                prepare({ title, subtitle }) {
                  return { title: title ?? "Social link", subtitle };
                },
              },
            },
          ],
        }),
      ],
    }),

    /* ------------------------------------------------------------------ */
    /* Header                                                              */
    /* ------------------------------------------------------------------ */
    defineField({
      name: "header",
      title: "Header",
      type: "object",
      group: "header",
      options: { collapsed: false },
      fields: [
        defineField({
          name: "links",
          title: "Navigation links",
          description:
            "Rendered in both the desktop bar and the mobile menu.",
          type: "array",
          of: [link()],
          validation: (rule) => rule.min(1).warning("Add at least one link."),
        }),
        link("cta"),
        defineField({
          name: "showSocialLinks",
          title: "Show social links",
          type: "boolean",
          initialValue: false,
          description:
            "Social links always render in the footer; this only controls the header.",
        }),
      ],
    }),

    /* ------------------------------------------------------------------ */
    /* Footer                                                              */
    /* ------------------------------------------------------------------ */
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      group: "footer",
      options: { collapsed: false },
      fields: [
        defineField({
          name: "mainContent",
          title: "Short pitch",
          type: "text",
          rows: 3,
          description: "Rendered under the logo.",
        }),
        defineField({
          name: "email",
          title: "Email",
          type: "string",
          validation: (rule) => rule.email().warning("That does not look like an email."),
        }),
        defineField({
          name: "phone",
          title: "Phone",
          type: "string",
        }),
        defineField({
          name: "columns",
          title: "Columns",
          type: "array",
          of: [link()],
        }),
        defineField({
          name: "base",
          title: "Base content",
          type: "string",
          description: "Copyright / legal line at the very bottom.",
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Layout" };
    },
  },
});

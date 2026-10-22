import { FiSettings } from "react-icons/fi";
import {
  defineField,
  defineType,
  type DocumentDefinition,
} from "sanity";
import { FaChartLine, FaGlobe } from "react-icons/fa";

export const SITE_SETTINGS_TYPE = "siteSettings";

/**
 * Site-wide settings singleton.
 *
 * Owns global SEO defaults and analytics only. Site identity, header, and
 * footer live on the separate `layout` singleton.
 *
 * The document `_id` is pinned to the schema type name by
 * `createSingleDocumentStructure` in `src/sanity/structure`, which is what
 * makes `*[_type == "siteSettings"][0]` safe in GROQ.
 *
 * Scope note: page-level metadata (title / description / slug / open graph /
 * robots / redirect) lives on each page's own `seo()` object. This document only
 * holds the *defaults* those objects inherit — it deliberately does not carry a
 * slug, because it is not routable.
 */
export const siteSettings: DocumentDefinition = defineType({
  name: SITE_SETTINGS_TYPE,
  title: "Site Settings",
  type: "document",
  icon: FiSettings,
  groups: [
    { name: "seo", title: "SEO", icon: FaGlobe },
    { name: "analytics", title: "Analytics", icon: FaChartLine },
  ],
  fields: [
    /* ------------------------------------------------------------------ */
    /* SEO defaults                                                        */
    /* ------------------------------------------------------------------ */
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      options: { collapsed: false },
      description:
        "Site-wide defaults. Pages override these through their own SEO object.",
      fields: [
        defineField({
          name: "titleTemplate",
          title: "Title template",
          type: "string",
          description:
            "`{title}` is replaced by the page title. Used only when the template contains it.",
          initialValue: "{title}",
          validation: (rule) => rule.required().error("Required."),
        }),
        defineField({
          name: "defaultOgImage",
          title: "Default social image",
          type: "customImage",
          description:
            "Used when a page has no Open Graph image of its own. Falls back to the layout logo.",
        }),
        defineField({
          name: "robots",
          title: "Robots",
          description:
            "Applied to every page. A switch turned on here can never be turned back off by a page — site-wide is site-wide.",
          type: "object",
          options: { collapsed: false },
          fields: [
            defineField({
              name: "disableIndex",
              title: "Disable search indexing",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "disableFollow",
              title: "Disable link following",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "disableImageIndex",
              title: "Disable image indexing",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "disableSnippet",
              title: "Disable search result snippet",
              type: "boolean",
              initialValue: false,
            }),
          ],
        }),
      ],
    }),

    /* ------------------------------------------------------------------ */
    /* Analytics                                                           */
    /* ------------------------------------------------------------------ */
    defineField({
      name: "analytics",
      title: "Analytics",
      type: "object",
      group: "analytics",
      options: { collapsed: false },
      fields: [
        defineField({
          name: "googleTagManagerID",
          title: "Google Tag Manager ID",
          type: "string",
          description:
            "Format `GTM-XXXXXX`. The frontend only injects the script when this matches exactly.",
          validation: (rule) =>
            rule.custom((value) => {
              if (!value) return true;
              return /^GTM-[A-Z0-9]+$/.test(value)
                ? true
                : "Expected the form GTM-XXXXXX.";
            }),
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});

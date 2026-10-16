// sanity/_root/seo.ts
import { defineField, ObjectRule, StringRule } from "sanity";
import { FaGlobe } from "react-icons/fa";
import { ISanitySlugOptions } from "./slug/interface";
import { slug } from "./slug";

export interface SeoArgs {
  slugOptions?: ISanitySlugOptions;
  /**
   * Set to `false` for documents that already own a route slug elsewhere
   * (e.g. `blogPost`, whose top level `slug` drives `/blog/[slug]`).
   */
  includeSlug?: boolean;
  /**
   * When `true` the whole `seo` object may be left empty and the individual
   * fields downgrade to warnings — used by documents that are content-first and
   * can fall back entirely to the site-wide defaults.
   */
  optional?: boolean;
  group?: string;
}

export const seoGroups = {
  main: { name: "main", title: "Main" },
  openGraph: { name: "openGraph", title: "Open Graph" },
  others: { name: "others", title: "Others" },
};

/**
 * Four `noindex`-style switches. Rendered as an object so the OR-merge in
 * `@/sanity/lib/metadata` has a single shape to consume at both levels.
 */
export const robotsField = defineField({
  name: "robots",
  title: "Robots",
  type: "object",
  group: seoGroups.main.name,
  options: { collapsed: false },
  fields: [
    defineField({
      name: "disableIndex",
      title: "Disable search indexing",
      description: "Adds `noindex` for this document.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "disableFollow",
      title: "Disable link following",
      description: "Adds `nofollow` for this document.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "disableImageIndex",
      title: "Disable image indexing",
      description: "Adds `noimageindex` for this document.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "disableSnippet",
      title: "Disable search result snippet",
      description: "Adds `nosnippet` for this document.",
      type: "boolean",
      initialValue: false,
    }),
  ],
});

export const seo = (args: SeoArgs) => {
  const includeSlug = args.includeSlug !== false;
  const optional = args.optional === true;

  return defineField({
    name: "seo",
    title: "SEO",
    type: "object",

    group: args.group || seoGroup.name,
    groups: [seoGroups.main, seoGroups.openGraph, seoGroups.others],
    fields: [
      defineField({
        name: "title",
        title: "Title",
        type: "string",
        group: seoGroups.main.name,
        validation: (rule: StringRule) => [
          ...(optional
            ? [
                rule
                  .warning(
                    "No title set — the site-wide title template will be used.",
                  ),
              ]
            : [rule.required().error("Please provide a title.")]),
          rule
            .max(60)
            .warning(
              "It is recommended keep the main title between 30 and 50 characters.",
            ),
        ],
      }),
      ...(includeSlug
        ? [
            slug({
              source: args.slugOptions?.source || "seo.title",
              isFixed: args.slugOptions?.isFixed || false,
              prefix: args.slugOptions?.prefix || "",
            }),
          ]
        : []),
      defineField({
        name: "description",
        title: "Description",
        type: "text",
        rows: 3,
        group: seoGroups.main.name,
        validation: (rule: StringRule) => [
          ...(optional
            ? [
                rule.warning(
                  "Please provide a description to improve SEO scores.",
                ),
              ]
            : [rule.required().error("Please provide a description.")]),
          rule
            .max(160)
            .warning(
              "It is recommended to keep the main description below 160 characters.",
            ),
        ],
      }),
      defineField({
        name: "openGraph",
        title: "Open Graph",
        type: "object",
        group: seoGroups.openGraph.name,
        options: { collapsed: true },
        description:
          "Overrides for link previews. Falls back to the title, description and the site-wide default image.",
        fields: [
          defineField({ name: "title", title: "Title", type: "string" }),
          defineField({
            name: "description",
            title: "Description",
            type: "text",
            rows: 2,
          }),
          defineField({
            name: "image",
            title: "Image",
            type: "customImage",
          }),
        ],
      }),
      robotsField,
      defineField({
        name: "canonicalUrl",
        title: "Canonical URL",
        description:
          "Leave empty to self-reference this page's URL.",
        type: "url",
        group: seoGroups.main.name,
      }),
      defineField({
        name: "redirect",
        title: "Redirect",
        description:
          "When set, visiting this document redirects here (https only).",
        type: "url",
        group: seoGroups.main.name,
        validation: (rule) =>
          rule.uri({ scheme: ["https"] }).error("Redirect must be an https URL."),
      }),
      defineField({
        name: "keywords",
        title: "Keywords",
        type: "array",
        of: [{ type: "string" }],
        options: { layout: "tags" },
        group: seoGroups.others.name,
      }),
      defineField({
        name: "jsonld",
        title: "JSON-LD",
        description:
          "Structured data injected as a `application/ld+json` script. Validate at https://validator.schema.org/",
        type: "code",
        group: seoGroups.others.name,
        options: {
          language: "json",
          languageAlternatives: [{ title: "JSON", value: "json" }],
          withFilename: false,
        },
      }),
    ],
    validation: (rule: ObjectRule) =>
      optional ? rule.custom(() => true) : rule.required(),
  });
};

export const seoGroup = {
  name: "seo",
  title: "SEO",
  icon: FaGlobe,
};
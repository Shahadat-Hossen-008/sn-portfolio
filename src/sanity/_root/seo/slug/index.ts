import { defineField } from "sanity";

import { Slug } from "@/sanity/types";
import { ISanitySlugOptions } from "./interface";
import SlugInput from "../../../components/slug-input";
import { generalPagesRestrictedSlugs } from "./restricted-slugs";

export function slugify(slug: string) {
  return slug
    .toLowerCase()
    .replace(/[^A-Za-z0-9&/\s-]/g, "")
    .trim()
    .replace(/&/g, "and")
    .replace(/\//g, "or")
    .replace(/\s+/g, "-")
    .slice(0, 200);
}

export function slug({ source, isFixed, prefix }: ISanitySlugOptions) {
  return defineField(
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: source,
        slugify: (input: string) => {
          return `${encodeURI(slugify(input))}`;
        },
        prefix,
        isFixed,
      },
      components: { input: SlugInput },
      validation: (rule) =>
        rule.custom<Slug>((currentValue, { document }) => {
          if (!isFixed) {
            if (currentValue !== undefined) {
              const slug = currentValue.current;

              if (slug.indexOf(" ") !== -1) {
                return "Please do not use spaces in a slug.";
              }

              if (slug.indexOf("/") !== -1) {
                return "Please remove any `/` from the slug.";
              }

              /**
               * Check if the slug matches any slug in the restrictions list.
               * This is used to prevent duplicate urls, incase we have fixed
               * hardcoded pages.
               */
              if (document) {
                if (document._type == "generalPage") {
                  if (
                    generalPagesRestrictedSlugs.includes(currentValue.current)
                  ) {
                    return "This is a reserved slug. Please use a different slug.";
                  }
                }
              }

              return true;
            } else {
              return "Please provide the url to this content.";
            }
          }
          return true;
        }),
    },
    { strict: false },
  );
}

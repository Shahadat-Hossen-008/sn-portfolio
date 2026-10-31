import { BsGrid3X3Gap } from "react-icons/bs";
import { defineArrayMember, defineField, defineType } from "sanity";

import { link } from "@/sanity/_root/link";
import { splitHeadline } from "@/lib/hero";

type PrimaryGroup = {
  items?: Array<{ isPrimary?: boolean } | null> | null;
} | null;

function countPrimaryItems(groups: unknown): number {
  if (!Array.isArray(groups)) return 0;
  return (groups as PrimaryGroup[]).reduce(
    (total, group) =>
      total +
      (group?.items ?? []).filter((item) => item?.isPrimary === true).length,
    0,
  );
}

/** Every tile is an optional object that starts collapsed. */
const collapsedTile = { collapsible: true, collapsed: true };

/** Tile title. `max` follows how much room the tile has in the layout. */
const tileTitle = (initialValue: string, max: number, fit: string) =>
  defineField({
    name: "title",
    title: "Title",
    type: "string",
    description: `Heading of this tile. ${fit} Max ${max} characters.`,
    initialValue,
    validation: (rule) => rule.max(max),
  });

/** A short list of strings, shown as chips or a typed line. */
const stringList = (options: {
  name: string;
  title: string;
  description: string;
  max: number;
  itemMax: number;
}) =>
  defineField({
    name: options.name,
    title: options.title,
    type: "array",
    description: options.description,
    validation: (rule) => rule.max(options.max),
    of: [
      defineArrayMember({
        type: "string",
        validation: (rule) => rule.max(options.itemMax),
      }),
    ],
  });

export const curiositySection = defineType({
  name: "curiositySection",
  title: "Stack & Curiosity",
  type: "document",
  icon: BsGrid3X3Gap,
  description:
    "A bento grid with five fixed, named tiles: Stack, Learning, Passion, Interests and Work. Every tile is optional. To extend the grid later, add a new named tile field; never turn the tiles into a list.",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description:
        "Small label above the heading, e.g. “Stack & curiosity”. The section number is added automatically, so don't type it. Max 40 characters.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description:
        "Main heading of the section. Aim for two lines at most. Max 70 characters.",
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: "headingAccent",
      title: "Heading accent",
      type: "string",
      description:
        "Optional. A phrase from the heading that is shown in italic with a highlight. It must appear in the heading exactly, including capital letters.",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (typeof value !== "string" || !value.trim()) return true;
          const heading = (context.parent as { heading?: string } | undefined)
            ?.heading;
          return splitHeadline(heading, value).length === 3
            ? true
            : "Heading accent must appear in the heading with matching case.";
        }),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      description:
        "One or two sentences under the heading. Max 160 characters.",
      validation: (rule) => rule.max(160),
    }),

    defineField({
      name: "stack",
      title: "Stack tile",
      type: "object",
      description:
        "The large tile: your tools in up to four groups. Leave it empty to hide the tile.",
      options: collapsedTile,
      fields: [
        tileTitle("Tools I reach for first", 40, "Fits on one line."),
        defineField({
          name: "groups",
          title: "Groups",
          type: "array",
          description:
            "Up to four groups, shown as blocks in a two-by-two grid. Mark at most six tools in total as daily drivers.",
          validation: (rule) => [
            rule.max(4),
            rule
              .warning()
              .custom((groups) =>
                countPrimaryItems(groups) > 6
                  ? "Mark at most six daily drivers."
                  : true,
              ),
          ],
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                  description: "Group name, e.g. Frontend. Max 16 characters.",
                  validation: (rule) => rule.required().max(16),
                }),
                defineField({
                  name: "description",
                  title: "Description",
                  type: "string",
                  description:
                    "One line about what you do with this group, e.g. “App Router, RSC, typed UI”. Max 34 characters.",
                  validation: (rule) => rule.max(34),
                }),
                defineField({
                  name: "items",
                  title: "Tools",
                  type: "array",
                  description:
                    "Up to six tools in this group. Pick from your technology tags so names stay consistent.",
                  validation: (rule) => rule.max(6),
                  of: [
                    defineArrayMember({
                      type: "object",
                      fields: [
                        defineField({
                          name: "tech",
                          title: "Technology",
                          type: "reference",
                          to: [{ type: "techTag" }],
                          description:
                            "Choose a technology tag. If it is missing, create it first under Miscellaneous.",
                          validation: (rule) => rule.required(),
                        }),
                        defineField({
                          name: "isPrimary",
                          title: "Daily driver",
                          type: "boolean",
                          description:
                            "Turn on for the tools you use most. A small dot marks them on the site. Keep to six across the whole tile.",
                          initialValue: false,
                        }),
                      ],
                      preview: {
                        select: { title: "tech.label", primary: "isPrimary" },
                        prepare: ({ title, primary }) => ({
                          title: title || "Technology",
                          subtitle: primary ? "Daily driver" : undefined,
                        }),
                      },
                    }),
                  ],
                }),
              ],
              preview: {
                select: { title: "label", note: "description", items: "items" },
                prepare: ({ title, note, items }) => ({
                  title,
                  subtitle: [note, `${items?.length ?? 0} tools`]
                    .filter(Boolean)
                    .join(" · "),
                }),
              },
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: "learning",
      title: "Learning tile",
      type: "object",
      description:
        "What you are learning now. The topics appear one after another as a typed line. Leave it empty to hide the tile.",
      options: collapsedTile,
      fields: [
        tileTitle("Currently studying", 28, "Fits on one line."),
        stringList({
          name: "topics",
          title: "Topics",
          description:
            "Up to three topics, shown one after another. Each has to fit on one line (28 characters).",
          max: 3,
          itemMax: 28,
        }),
        defineField({
          name: "upNext",
          title: "Up next",
          type: "string",
          description:
            "Optional. The next book or course, shown as a small line at the bottom of the tile. Max 30 characters.",
          validation: (rule) => rule.max(30),
        }),
      ],
    }),

    defineField({
      name: "passion",
      title: "Passion tile",
      type: "object",
      description:
        "A light tile with one sentence about what drives you. Leave it empty to hide the tile.",
      options: collapsedTile,
      fields: [
        defineField({
          name: "statement",
          title: "Statement",
          type: "text",
          rows: 3,
          description:
            "One honest sentence in your own voice. Max 90 characters, so it stays within three lines.",
          validation: (rule) => rule.required().max(90),
        }),
      ],
    }),

    defineField({
      name: "interests",
      title: "Interests tile",
      type: "object",
      description:
        "Things you enjoy outside work, shown as chips. Leave it empty to hide the tile.",
      options: collapsedTile,
      fields: [
        tileTitle("Outside the editor", 28, "Fits on one line."),
        stringList({
          name: "items",
          title: "Interests",
          description:
            "Up to five short interests, shown as chips (24 characters each).",
          max: 5,
          itemMax: 24,
        }),
      ],
    }),

    defineField({
      name: "work",
      title: "Work tile",
      type: "object",
      description:
        "A tile that points visitors to your project pages and lists recent work. Leave it empty to hide the tile.",
      options: collapsedTile,
      fields: [
        tileTitle(
          "The work lives on its own pages.",
          40,
          "Wraps to two lines.",
        ),
        {
          ...link("cta"),
          title: "Call to action",
          description:
            "The button. It can only link to routes declared in ROUTES_BY_TYPE, so project pages need a route first.",
        },
        defineField({
          name: "projects",
          title: "Projects",
          type: "array",
          description:
            "Up to three projects to feature. Leave empty to show the three most recent.",
          validation: (rule) => rule.max(3),
          of: [
            defineArrayMember({ type: "reference", to: [{ type: "project" }] }),
          ],
        }),
      ],
    }),
  ],
  validation: (rule) =>
    rule.warning().custom((value) => {
      const tiles = value as Record<string, unknown> | undefined;
      const hasTile = ["stack", "learning", "passion", "interests", "work"].some(
        (key) => tiles?.[key],
      );
      return hasTile ? true : "Add at least one tile.";
    }),
  preview: {
    select: {
      heading: "heading",
      eyebrow: "eyebrow",
      stack: "stack",
      learning: "learning",
      passion: "passion",
      interests: "interests",
      work: "work",
    },
    prepare({ heading, eyebrow, stack, learning, passion, interests, work }) {
      const tiles = [stack, learning, passion, interests, work].filter(
        Boolean,
      ).length;
      return {
        title: heading || "Stack & curiosity",
        subtitle: eyebrow || `${tiles} tile${tiles === 1 ? "" : "s"} set`,
      };
    },
  },
});
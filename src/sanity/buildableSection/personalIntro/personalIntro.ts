import { defineField } from "sanity";
import { link } from "@/sanity/_root/link";

const collapsedTile = { collapsible: true, collapsed: true };

export const personalIntroField = defineField({
  name: "personalIntro",
  title: "Personal introduction tile",
  type: "object",
  description: "Left tile: display name, a short bio, and the About link.",
  options: collapsedTile,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow label",
      type: "string",
      description:
        "Small uppercase label, e.g. Personal Introduction. Max 30 characters.",
      initialValue: "Personal Introduction",
      validation: (rule) => rule.max(30),
    }),
    defineField({
      name: "title",
      title: "Display name or title",
      type: "string",
      description:
        "Your full name or main headline, e.g. Shahadat Hossain. Max 50 characters.",
      validation: (rule) => rule.max(50),
    }),
    defineField({
      name: "bio",
      title: "Short bio",
      type: "text",
      rows: 3,
      description:
        "A concise 3–4 line introduction explaining who you are and what you craft. Max 280 characters. The About page holds the long version.",
      validation: (rule) => rule.max(280),
    }),
    {
      ...link("cta"),
      title: "Call to action link",
      description:
        "Button or link to your detailed About page or resume (e.g. More about me).",
    },
  ],
});

import { BsArrowRightCircle } from "react-icons/bs";
import { defineType } from "sanity";

import { link } from "@/sanity/_root/link";
import { sectionHeaderFields } from "@/sanity/_root/section-header";

export const ctaSection = defineType({
  name: "ctaSection",
  title: "Call to action",
  type: "document",
  icon: BsArrowRightCircle,
  description:
    "A closing call-to-action band. Reusable: create it once and reference it from any page.",
  fields: [
    ...sectionHeaderFields({
      headingMax: 60,
      introMax: 120,
      headingDescription:
        "The band's heading, shown large on the left, e.g. “Thoughtful teams, useful products.”. Max 60 characters.",
      introDescription:
        "The supporting sentence next to the button. Max 120 characters.",
    }),
    {
      ...link("cta"),
      title: "Call to action",
      description:
        "The button. It can only link to routes declared in ROUTES_BY_TYPE. Leave the link unset to hide the button.",
    },
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Call to action",
      subtitle: subtitle || "Call to action",
    }),
  },
});

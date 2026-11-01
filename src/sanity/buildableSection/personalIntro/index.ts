import { BsGrid3X3Gap } from "react-icons/bs";
import { defineField, defineType } from "sanity";
import { availabilityField } from "./availability";
import { beyondCodeField } from "./beyondCode";
import { capabilitiesField } from "./capabilities";
import { learningField } from "./learning";
import { personalIntroField } from "./personalIntro";
import { workField } from "./work";

export const personalIntroSection = defineType({
  name: "personalIntroSection",
  title: "Personal Introduction",
  type: "document",
  icon: BsGrid3X3Gap,
  description:
    "A 5-card personal introduction bento grid: Personal Introduction, Selected Project, Currently Building, Beyond Code, and Availability.",
  fields: [
    defineField({
      name: "heading",
      title: "Section title (Studio only)",
      type: "string",
      description:
        "Internal title for this section document in the Studio. Not shown on the website.",
      initialValue: "Personal Introduction",
      validation: (rule) => rule.required(),
    }),
    capabilitiesField,
    personalIntroField,
    workField,
    learningField,
    beyondCodeField,
    availabilityField,
  ],
  validation: (rule) =>
    rule.warning().custom((value) => {
      const tiles = value as Record<string, unknown> | undefined;
      const hasTile = [
        "personalIntro",
        "work",
        "learning",
        "beyondCode",
        "availability",
      ].some((key) => tiles?.[key]);
      return hasTile ? true : "Add at least one tile.";
    }),
  preview: {
    select: {
      heading: "heading",
      personalIntro: "personalIntro",
      work: "work",
      learning: "learning",
      beyondCode: "beyondCode",
      availability: "availability",
    },
    prepare({
      heading,
      personalIntro,
      work,
      learning,
      beyondCode,
      availability,
    }) {
      const tiles = [
        personalIntro,
        work,
        learning,
        beyondCode,
        availability,
      ].filter(Boolean).length;
      return {
        title: heading || "Personal Introduction",
        subtitle: `${tiles} tile${tiles === 1 ? "" : "s"} configured`,
      };
    },
  },
});

export default personalIntroSection;

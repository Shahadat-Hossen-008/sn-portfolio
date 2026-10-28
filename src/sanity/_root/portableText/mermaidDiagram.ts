import { defineField, defineType } from "sanity";
import { CodeBlockIcon } from "@sanity/icons";

export const mermaidDiagram = defineType({
  name: "mermaidDiagram",
  type: "object",
  title: "Mermaid Diagram",
  icon: CodeBlockIcon,
  fields: [
    defineField({
      name: "caption",
      title: "Diagram Caption",
      description: "Optional title or caption displayed with the architecture diagram.",
      type: "string",
    }),
    defineField({
      name: "code",
      title: "Mermaid Syntax",
      description:
        "Mermaid diagram definition (e.g. flowchart TD, sequenceDiagram, erDiagram).",
      type: "text",
      rows: 8,
      validation: (rule) =>
        rule.required().error("Please provide the Mermaid diagram code."),
    }),
  ],
  preview: {
    select: {
      caption: "caption",
      code: "code",
    },
    prepare({ caption, code }) {
      const firstLine =
        typeof code === "string" ? code.trim().split("\n")[0] : "";
      return {
        title: caption || "Mermaid Diagram",
        subtitle: firstLine || "Interactive Diagram",
        media: CodeBlockIcon,
      };
    },
  },
});

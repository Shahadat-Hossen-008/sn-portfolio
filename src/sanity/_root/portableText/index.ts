import { defineArrayMember, defineField } from "sanity";
import { block } from "./block";
import { youtube } from "./iframe";
import { code } from "./code";
import { editorialSection } from "./editorialSection";
import { decisionCards, decisionCardItem } from "./decisionCards";
import { outcomeMetrics, outcomeStatItem } from "./outcomeState";
import {
  portableTable,
  portableTableCell,
  portableTableHeader,
  portableTableRow,
} from "./portableTable";
import { mermaidDiagram } from "./mermaidDiagram";

export {
  editorialSection,
  decisionCards,
  decisionCardItem,
  outcomeMetrics,
  outcomeStatItem,
  portableTable,
  portableTableCell,
  portableTableHeader,
  portableTableRow,
  mermaidDiagram,
};

export default defineField({
  name: "portableText",
  type: "array",
  title: "Portable Text",
  of: [
    defineArrayMember(block),
    defineArrayMember({
      name: "portableTextImage",
      type: "customImage",
      title: "Image",
    }),
    defineArrayMember(code),
    defineArrayMember(youtube),
    defineArrayMember({
      name: "editorialSection",
      type: "editorialSection",
      title: "Editorial Section (Column / Straightforward)",
    }),
    defineArrayMember({
      name: "decisionCards",
      type: "decisionCards",
      title: "Decision Cards Grid",
    }),
    defineArrayMember({
      name: "outcomeMetrics",
      type: "outcomeMetrics",
      title: "Outcome Stats Grid",
    }),
    defineArrayMember({
      name: "portableTable",
      type: "portableTable",
      title: "Editorial Table",
    }),
    defineArrayMember({
      name: "mermaidDiagram",
      type: "mermaidDiagram",
      title: "Mermaid Diagram",
    }),
  ],
});

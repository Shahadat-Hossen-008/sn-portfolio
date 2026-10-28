import { defineArrayMember, defineField, defineType } from "sanity";
import { ThListIcon } from "@sanity/icons";
import { toPlainText } from "@portabletext/react";
import { block } from "./block";

export const portableTableHeader = defineType({
  name: "portableTableHeader",
  type: "object",
  title: "Column Header",
  fields: [
    defineField({
      name: "label",
      title: "Header Label",
      type: "string",
      validation: (rule) =>
        rule.required().error("Column header label is required."),
    }),
  ],
  preview: {
    select: {
      title: "label",
    },
    prepare({ title }) {
      return {
        title: title || "Column Header",
      };
    },
  },
});

export const portableTableCell = defineType({
  name: "portableTableCell",
  type: "object",
  title: "Table Cell",
  fields: [
    defineField({
      name: "content",
      title: "Cell Content",
      description: "Rich text content for this table cell.",
      type: "array",
      of: [defineArrayMember(block)],
    }),
  ],
  preview: {
    select: {
      content: "content",
    },
    prepare({ content }) {
      const plain = content ? toPlainText(content).slice(0, 60) : "";
      return {
        title: plain || "Empty cell",
      };
    },
  },
});

export const portableTableRow = defineType({
  name: "portableTableRow",
  type: "object",
  title: "Table Row",
  fields: [
    defineField({
      name: "cells",
      title: "Row Cells",
      type: "array",
      of: [defineArrayMember({ type: "portableTableCell" })],
      validation: (rule) =>
        rule.required().min(1).error("Add at least one cell to the row."),
    }),
  ],
  preview: {
    select: {
      cells: "cells",
    },
    prepare({ cells }) {
      const summary = Array.isArray(cells)
        ? cells
            .map((cell) =>
              cell?.content ? toPlainText(cell.content).trim() : "",
            )
            .filter(Boolean)
            .join(" | ")
        : "";
      return {
        title: summary ? summary.slice(0, 70) : "Table Row",
        subtitle: `${Array.isArray(cells) ? cells.length : 0} cells`,
      };
    },
  },
});

export const portableTable = defineType({
  name: "portableTable",
  type: "object",
  title: "Editorial Table",
  icon: ThListIcon,
  fields: [
    defineField({
      name: "caption",
      title: "Table Caption",
      description: "Optional caption or title for the table.",
      type: "string",
    }),
    defineField({
      name: "columnHeaders",
      title: "Column Headers",
      type: "array",
      of: [defineArrayMember({ type: "portableTableHeader" })],
      validation: (rule) =>
        rule.required().min(1).error("Add at least one column header."),
    }),
    defineField({
      name: "rows",
      title: "Table Rows",
      type: "array",
      of: [defineArrayMember({ type: "portableTableRow" })],
      validation: (rule) =>
        rule.required().min(1).error("Add at least one row."),
    }),
  ],
  preview: {
    select: {
      caption: "caption",
      columnHeaders: "columnHeaders",
      rows: "rows",
    },
    prepare({ caption, columnHeaders, rows }) {
      const headers = Array.isArray(columnHeaders)
        ? columnHeaders
            .map((h) => h?.label)
            .filter(Boolean)
            .join(" · ")
        : "";
      const rowCount = Array.isArray(rows) ? rows.length : 0;

      return {
        title: caption || headers || "Editorial Table",
        subtitle: `${rowCount} row${rowCount === 1 ? "" : "s"}`,
        media: ThListIcon,
      };
    },
  },
});

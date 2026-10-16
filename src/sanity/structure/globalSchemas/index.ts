import { StructureBuilder } from "sanity/structure";
import { globalSchemas } from "@/sanity/schemaTypes";
import { FiSettings } from "react-icons/fi";
import type { ComponentType } from "react";
import { createSingleDocumentStructure } from "../utils/create-document-structure";

/**
 * Renders every registered singleton as a pinned, non-creatable entry at the
 * very top of the sidebar.
 *
 * `createSingleDocumentStructure` sets the document id to the schema name, so
 * the sidebar always resolves the same document — creating it once and only
 * once. That is the contract GROQ's `*[_type == "siteSettings"][0]` relies on.
 */
export default function globalSchemasStructure(S: StructureBuilder) {
  return globalSchemas.map((schema) =>
    createSingleDocumentStructure(
      schema.name,
      schema.title ?? "Global Settings",
      S,
      (schema.icon as ComponentType | undefined) ?? FiSettings,
    ),
  );
}
import { StructureBuilder } from "sanity/structure";
import { layout } from "@/sanity/global/layout";
import { FiSettings } from "react-icons/fi";
import type { ComponentType } from "react";
import { createSingleDocumentStructure } from "../utils/create-document-structure";

/**
 * Renders the `layout` singleton as a pinned entry at the top of the sidebar.
 * `createSingleDocumentStructure` sets the document id to the schema name, so
 * the sidebar always resolves the same document — creating it once and only
 * once. That is the contract GROQ's `*[_type == "layout"][0]` relies on.
 */
export default function layoutStructure(S: StructureBuilder) {
  return createSingleDocumentStructure(
    layout.name,
    layout.title ?? "Layout",
    S,
    (layout.icon as ComponentType | undefined) ?? FiSettings,
  );
}

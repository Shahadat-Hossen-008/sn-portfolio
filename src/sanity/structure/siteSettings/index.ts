import { StructureBuilder } from "sanity/structure";
import { siteSettings } from "@/sanity/global/siteSettings";
import { FiSettings } from "react-icons/fi";
import type { ComponentType } from "react";
import { createSingleDocumentStructure } from "../utils/create-document-structure";

/**
 * Renders the `siteSettings` singleton as a pinned entry at the top of the
 * sidebar. `createSingleDocumentStructure` sets the document id to the schema
 * name, so the sidebar always resolves the same document — creating it once
 * and only once. That is the contract GROQ's `*[_type == "siteSettings"][0]`
 * relies on.
 */
export default function siteSettingsStructure(S: StructureBuilder) {
  return createSingleDocumentStructure(
    siteSettings.name,
    siteSettings.title ?? "Site Settings",
    S,
    (siteSettings.icon as ComponentType | undefined) ?? FiSettings,
  );
}

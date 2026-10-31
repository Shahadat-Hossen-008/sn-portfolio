import { RxSection } from "react-icons/rx";
import { StructureBuilder } from "sanity/structure";
import { sections } from "@/sanity/schemaTypes";
import { createDynamicDocumentStructure } from "../utils/create-document-structure";

export default function sectionsStructure(S: StructureBuilder) {
  return S.listItem()
    .title("Page Sections")
    .icon(RxSection)
    .child(
      S.list()
        .title("Page Sections")
        .id("pageSections")
        .items(
          sections.map((section) =>
            createDynamicDocumentStructure(
              section.name,
              section.title ?? section.name,
              S,
              section.icon,
            ),
          ),
        ),
    );
}

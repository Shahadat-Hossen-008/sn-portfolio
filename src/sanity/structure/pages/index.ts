import { plural } from "pluralize";
import { StructureBuilder } from "sanity/structure";
import { fixedPages } from "@/sanity/schemaTypes";
import { IoDocuments } from "react-icons/io5";
import { createSingleDocumentStructure } from "../utils/create-document-structure";

export default function pagesStructure(S: StructureBuilder) {
  return S.listItem()
    .title("Pages")
    .icon(IoDocuments)
    .child(
      S.list()
        .title("Pages")
        .id("pages")
        .items(
          [...fixedPages.map((page) =>
            createSingleDocumentStructure(page.name, page.title ?? "page",  S),
          )]
        ),
    );
}

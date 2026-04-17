import { StructureBuilder } from "sanity/structure";

export const createSingleDocumentStructure = (
  schemaName: string,
  title: string,
  S: StructureBuilder,
) => {
 return S.documentTypeListItem(schemaName)
    .schemaType(schemaName)
      .title(title ?? "Section")
      .id(schemaName)
      .child(S.document().schemaType(schemaName).documentId(schemaName));
};

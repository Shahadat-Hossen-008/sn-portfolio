import { StructureBuilder } from "sanity/structure";
import type { ComponentType, ReactNode } from "react";

export const createSingleDocumentStructure = (
  schemaName: string,
  title: string,
  S: StructureBuilder,
  icon?: ComponentType,
) => {
  const item = S.documentTypeListItem(schemaName)
    .schemaType(schemaName)
    .title(title ?? "Section")
    .id(schemaName)
    .child(S.document().schemaType(schemaName).documentId(schemaName));

  return icon ? item.icon(icon) : item;
};

export const createDynamicDocumentStructure = (
  schemaName: string,
  title: string,
  S: StructureBuilder,
  icon?: ComponentType | ReactNode,
) => {
  const item = S.documentTypeListItem(schemaName).title(title);

  return icon !== undefined ? item.icon(icon as ComponentType) : item;
};

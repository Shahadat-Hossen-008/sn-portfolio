import { entitiesWithoutPages } from "@/sanity/schemaTypes";
import { BsFolderSymlinkFill } from "react-icons/bs";
import { StructureBuilder } from "sanity/structure";

export default function entitiesStructure(S: StructureBuilder) {
  return S.listItem()
    .title("Entities")
    .icon(BsFolderSymlinkFill)
    .child(
      S.list()
        .title("Entities")
        .items([
          ...[...entitiesWithoutPages].map((entity) =>
            S.documentTypeListItem(entity.name)
              .title(entity.title ?? entity.name)
              .icon(entity.icon),
          ),
        ]),
    );
}

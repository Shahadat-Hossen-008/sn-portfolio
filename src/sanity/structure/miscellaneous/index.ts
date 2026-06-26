import { miscellaneous } from "@/sanity/schemaTypes";
import { VscSymbolMisc } from "react-icons/vsc";
import { StructureBuilder } from "sanity/structure";

export default function miscellaneousStructure(S: StructureBuilder) {
  return S.listItem()
    .title("Miscellaneous")
    .icon(VscSymbolMisc)
    .child(
      S.list()
        .title("Miscellaneous")
        .items(
          [...miscellaneous].map((entity) =>
            S.documentTypeListItem(entity.name)
              .title(entity.title ?? entity.name)
              .icon(entity.icon),
          ),
        ),
    );
}

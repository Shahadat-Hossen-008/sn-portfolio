import { plural} from 'pluralize';
import { StructureBuilder } from "sanity/structure";
import { fixedPages } from "@/sanity/schemaTypes";
import { IoDocuments } from 'react-icons/io5';

export default function pagesStructure(S: StructureBuilder) {
  return S.listItem()
            .title("Pages")
            .icon(IoDocuments)
            .child(
              S.list()
                .title("Pages")
                .items(
                  [
                    ...fixedPages.map((section) =>
                   S.documentTypeListItem(section.name)
      .title(plural(section.title ?? "Section"))
      .icon(section.icon) 
                  )
                  ]
                ),
            );

}
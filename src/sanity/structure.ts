


// https://www.sanity.io/docs/structure-builder-cheat-sheet
import entitiesStructure from "./structure/entitiesStructure";
import pagesStructure from "./structure/pages";
import { StructureBuilder } from "sanity/structure";


export function structure(S:StructureBuilder) {
  return  S.list()
      .title("Content")
      .items([
        pagesStructure(S),
        S.divider(),
        ...entitiesStructure(S),
      ]);
}

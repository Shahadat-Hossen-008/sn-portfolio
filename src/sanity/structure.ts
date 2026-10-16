// https://www.sanity.io/docs/structure-builder-cheat-sheet
import entitiesStructure from "./structure/entitiesStructure";
import layoutStructure from "./structure/layout";
import miscellaneousStructure from "./structure/miscellaneous";
import pagesStructure from "./structure/pages";
import siteSettingsStructure from "./structure/siteSettings";
import { StructureBuilder } from "sanity/structure";

export function structure(S: StructureBuilder) {
  return S.list()
    .title("Shahadat's Content")
    .items([
      siteSettingsStructure(S),
      layoutStructure(S),
      S.divider(),
      pagesStructure(S),
      S.divider(),
      entitiesStructure(S),
      S.divider(),
      miscellaneousStructure(S),
    ]);
}

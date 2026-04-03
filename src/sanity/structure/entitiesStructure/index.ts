import { entities } from "@/sanity/schemaTypes";
import { StructureBuilder } from "sanity/structure";

export default function entitiesStructure(S: StructureBuilder){
    return entities.map((entity) => S.documentTypeListItem(entity.name).title(entity.title ?? entity.name).icon(entity.icon));
}
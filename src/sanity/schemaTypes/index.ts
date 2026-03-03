import { type SchemaTypeDefinition } from "sanity";
import { about } from "./about";
import { tagType } from "./tagType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [about, tagType],
};

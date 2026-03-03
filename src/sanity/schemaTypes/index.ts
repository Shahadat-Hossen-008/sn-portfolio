import { type SchemaTypeDefinition } from "sanity";
import { profile } from "./profile";
import { about } from "./about";
import { tagType } from "./tagType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [profile, about, tagType],
};

import { type SchemaTypeDefinition } from "sanity";
import { profile } from "./profile";
import { about } from "./about";
import { tagType } from "../Miscellaneous/tagType";
import { blockContentType } from "../objects/blockContentTextType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [profile, about, tagType, blockContentType],
};

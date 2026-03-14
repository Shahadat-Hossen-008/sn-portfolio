import { type SchemaTypeDefinition } from "sanity";
import { project } from "./project";
import { profile } from "./profile";
import { about } from "./about";
import { tagType } from "../Miscellaneous/tagType";
import { blockContentType } from "../objects/blockContentTextType";
import { customImage } from "./customImage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [profile, about, tagType, blockContentType, project, customImage],
};

import { type SchemaTypeDefinition } from "sanity";
import { project } from "./project";
import { profile } from "./profile";
import { customImage } from "../objects/customImage";
import { about } from "./about";
import { tagType } from "../Miscellaneous/tagType";
import { blockContentType } from "../objects/blockContentTextType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [profile, about, tagType, project, customImage, blockContentType],
};

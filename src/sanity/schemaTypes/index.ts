import { type SchemaTypeDefinition } from "sanity";
import { profile } from "./profile";
import { blogType } from "./blogType";
import { blockContentType } from "../objects/blockContentType";
import { customImage } from "../objects/customImage";
import { categoryType } from "../Miscellaneous/categoryType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [profile, blogType, blockContentType, customImage, categoryType],
};

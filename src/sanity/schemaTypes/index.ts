import { type SchemaTypeDefinition } from "sanity";
import { profile } from "./profile";
import { about } from "./about";
import { blogType } from "./blogType";
import { customImage } from "../objects/customImage";
import { categoryType } from "../Miscellaneous/categoryType";
import { tagType } from "../Miscellaneous/tagType";
import { blockContentType } from "../objects/blockContentTextType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    profile,
    about,
    tagType,
    blogType,
    blockContentType,
    customImage,
    categoryType,
  ],
};

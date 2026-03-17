import { type SchemaTypeDefinition } from "sanity";
import { profile } from "./profile";
import { about } from "./about";
import { blogType } from "./blogType";
import { customImage } from "../objects/customImage";
import { categoryType } from "../Miscellaneous/categoryType";
import { tagType } from "../Miscellaneous/tagType";
import { blockContentTextType } from "../objects/blockContentTextType";
import { blockContentType } from "../objects/blockContentType";
import { linkType } from "../objects/linkType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    profile,
    about,
    tagType,
    blogType,
    blockContentTextType,
    blockContentType,
    customImage,
    categoryType,
    linkType,
  ],
};

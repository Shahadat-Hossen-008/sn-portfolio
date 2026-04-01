import { type SchemaTypeDefinition } from "sanity";
import { project } from "./project";
import { profile } from "./profile";
import { about } from "./about";
import { blogType } from "./blogType";
import { customImage } from "../objects/customImage";
import { categoryType } from "../Miscellaneous/categoryType";
import { tagType } from "../Miscellaneous/tagType";
import { blockContentTextType } from "../objects/blockContentTextType";
import { blockContentType } from "../objects/blockContentType";
import { linkType } from "../objects/linkType";
import { youtube } from "../objects/youTubeTypes";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    profile,
    about,
    tagType,
    project,
    customImage,
    blogType,
    blockContentTextType,
    blockContentType,
    categoryType,
    linkType,
    youtube,
  ],
};

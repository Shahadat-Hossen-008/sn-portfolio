import { DocumentDefinition, type SchemaTypeDefinition } from "sanity";
// Entities
import author from "../entites/author";
// Hoisted objects
import portableText from "../_root/portableText";
import { customImage } from "../_root/media";
import { categoryType } from "../_root/category";
// Pages
import { profile } from "../pages/profilePage";
// ?previous define schema
// import { project } from "./project";
// import { profile } from "./profile";
// import { about } from "./about";
// import { blogType } from "./blogType";
// import { customImage } from "../objects/customImage";
// import { categoryType } from "../Miscellaneous/categoryType";
// import { tagType } from "../Miscellaneous/tagType";
// import { blockContentTextType } from "../objects/blockContentTextType";
// import { blockContentType } from "../objects/blockContentType";
// import { linkType } from "../objects/linkType";
// import { youtube } from "../objects/youTubeTypes";

export const entities: DocumentDefinition[] = [ author];
export const hoistedObjects: SchemaTypeDefinition[] =[
  portableText,
  customImage,
  categoryType
]
export const fixedPages: DocumentDefinition[] = [ profile];

export const schema = {
  types: [
    ...entities,
    ...hoistedObjects,
    ...fixedPages,
  ],
};

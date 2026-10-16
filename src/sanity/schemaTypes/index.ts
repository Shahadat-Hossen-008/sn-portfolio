import { DocumentDefinition, type SchemaTypeDefinition } from "sanity";
// Entities
import author from "../entites/author";
import blogPost from "../entites/blogPost";
import { projectTemplate } from "../entites/project";
// Hoisted objects
import portableText from "../_root/portableText";
import { customImage } from "../_root/media";
import { technologyItem } from "../_root/technology-item";
import technologies from "../buildableSection/technologies";
import profileContent from "../buildableSection/profileContent";
import { pageSection } from "../_root/sections";
import richText from "../buildableSection/richText";
import carouselTech from "../buildableSection/carouselTech";
// pages
import { profile } from "../pages/profilePage";
import { about } from "../pages/aboutPage";
import { blogTag } from "../miscellaneous/blog-tag";
import { project } from "../pages/projectPage";
// miscellaneous
import { techTag } from "../miscellaneous/tech-tag";
// ?previous define schema
// import { project } from "./project";
// import { profile } from "./profile";
// import { about } from "./about";
// import { blogType } from "./blogType";
// import { customImage } from "../objects/customImage";
// import { technologyItem } from "../Miscellaneous/technologyItem";
// import { tagType } from "../Miscellaneous/tagType";
// import { blockContentTextType } from "../objects/blockContentTextType";
// import { blockContentType } from "../objects/blockContentType";
// import { linkType } from "../objects/linkType";
// import { youtube } from "../objects/youTubeTypes";

export const entities: DocumentDefinition[] = [
  author,
  blogPost,
  projectTemplate,
];
export const hoistedObjects: SchemaTypeDefinition[] =[
  portableText,
  customImage,
  technologyItem,

  pageSection,

  // buildable section
  profileContent,
  technologies,
  richText,
  carouselTech,
];
export const fixedPages: DocumentDefinition[] = [profile, about, project];

export const miscellaneous = [blogTag, techTag];

export const schema = {
  types: [
    ...entities,
    ...hoistedObjects,
    ...fixedPages,
    ...miscellaneous,
  ],
};

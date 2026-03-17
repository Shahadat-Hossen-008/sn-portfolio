import { type SchemaTypeDefinition } from "sanity";
import { profile } from "./profile";
import { project } from "./project";
import { customImage } from "../objects/customImage";
import { about } from "./about";
import { tagType } from "../Miscellaneous/tagType";
import { blockContentType } from "../objects/blockContentTextType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    profile,
    about,
    tagType,
    blockContentType,
    project,
    customImage({
      name: "projectImage",
      title: "Project Image",
      isClickable: true,
    }),
  ],
};

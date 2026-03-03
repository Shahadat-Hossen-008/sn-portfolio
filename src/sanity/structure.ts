import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
import { InfoOutlineIcon, UserIcon } from "@sanity/icons";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Singleton Profile
      S.listItem()
        .title("Profile Page")
        .icon(UserIcon)
        .child(
          S.document().schemaType("profilePage").documentId("profilePage"),
        ),
      // Singleton About
      S.listItem()
        .title("About Page")
        .icon(InfoOutlineIcon)
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      // All other document types except 'profile'
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() !== "profilePage" && item.getId() !== "aboutPage",
      ),
    ]);

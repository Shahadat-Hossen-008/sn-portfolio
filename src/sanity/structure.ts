import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
import { UserIcon } from "@sanity/icons";

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
      // All other document types except 'profile'
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== "profilePage",
      ),
    ]);

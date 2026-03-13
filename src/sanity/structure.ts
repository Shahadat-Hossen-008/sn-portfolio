

// https://www.sanity.io/docs/structure-builder-cheat-sheet
import { InfoOutlineIcon, UserIcon } from "@sanity/icons";
import { singletonStructure } from "./plugin/singletonPlugin";

export const structure = singletonStructure([
  { name: "profilePage", title: "Profile Page", icon: UserIcon },
  { name: "aboutPage", title: "About Page", icon: InfoOutlineIcon },
])

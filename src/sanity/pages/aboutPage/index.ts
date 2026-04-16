import { InfoOutlineIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const about = defineType({
    name: "aboutPage",
    title: "About Page",
    type: "document",
    icon: InfoOutlineIcon,
    fields: [
        defineField({
            name:"pageSections",
            title:"Page Sections",
            type: "pageSections"
        }),
    ],
})
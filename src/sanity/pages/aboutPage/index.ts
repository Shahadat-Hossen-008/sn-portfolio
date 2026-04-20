import { seo, seoGroup } from "@/sanity/_root/seo";
import { InfoOutlineIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { SiSanity } from "react-icons/si";
export const about = defineType({
    name: "aboutPage",
    title: "About Page",
    type: "document",
    icon: InfoOutlineIcon,
    groups:[
       seoGroup,
        {
            name:"content",
            title:"Content",
            icon: SiSanity,
            default: true

        }
    ],
    fields: [

        seo({group:"seo", slugOptions:{isFixed: true, prefix:"about"}}),
        defineField({
            name:"pageSections",
            title:"Page Sections",
            type: "pageSections",
            group:"content",
        })
    ],
    preview: {
    select: {
      title: "seo.title",
    },
    prepare({ title }) {
      return {
        title: title,
        subtitle: "About Page",
      };
    },
  },
})
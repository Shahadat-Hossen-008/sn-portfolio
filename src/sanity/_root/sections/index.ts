import {  defineType } from "sanity";

export const pageSection =  defineType({
  name: "pageSections",
  title: "page Sections",
  type: "array",
  of:[
    {
      title: "Profile Content",
      type:"profileContent"
    },
    {
      title: "Rich Text",
      type:"richTextSection"
    },
    {
      title: "Image",
      type: "customImage"
    },
    {
      title: "Technology",
      type: "technologySection"
    },
    {
      title: "Carousel Technology",
      type: "technologyCarousel"
    }

  ],
  options:{
    insertMenu:{
      filter: true,
      views:[
        {
          name: "grid",
        }
      ],
      groups: [
        {
          name: "profile",
          of: ["profileContent"],
        },
        {
          name: "sections",
          of: [ "richTextSection", "technologyCarousel", "technologySection"],
        },
      ],
    }
  }
})
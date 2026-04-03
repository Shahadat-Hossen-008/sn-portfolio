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
    }
  ],
  options:{
    insertMenu:{
      filter: true,
      views:[
        {
          name: "grid",
        }
      ]
    }
  }
})
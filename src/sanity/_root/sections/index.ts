import { defineArrayMember, defineType } from "sanity";

export const pageSection =  defineType({
  name: "pageSections",
  title: "page Sections",
  type: "array",
  of:[
    defineArrayMember({
      title: "Profile Content",
      type:"profileContent"
    }),
    defineArrayMember({
      title: "Rich Text",
      type:"richTextSection"
    }),
    defineArrayMember({
      title: "Image",
      type: "customImage"
    }),
    defineArrayMember({
      title: "Technology",
      type: "technologySection"
    }),
    defineArrayMember({
      title: "Carousel Technology",
      type: "technologyCarousel"
    }),
    defineArrayMember({ title: "Stack & Curiosity", type: "curiositySection" }),

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
          of: ["profileContent", "curiositySection"],
        },
        {
          name: "sections",
          of: [
            "richTextSection",
            "technologyCarousel",
            "technologySection",
            "customImage",
          ],
        },
      ],
    }
  }
})

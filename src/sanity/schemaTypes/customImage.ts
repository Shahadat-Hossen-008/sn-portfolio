import { defineField, defineType } from "sanity";

export const customImage = defineType({
 name: "CustomImage",
 type: "image",
 title: "Image",
 options: {
   hotspot: true,
 },
 
 fields: [
   defineField({
     name: "alt",
     title: "Alt Text",
     type: "string",
     description: "For accessibility, screen readers, SEO",
     validation: (Rule) => Rule.required().warning("Alt text is required for accessibility"),
   }),
   defineField({
    name: "link",
    title: "Link",
    type: "url",
    description: " Makes the image clickable",
   })
 ],
})
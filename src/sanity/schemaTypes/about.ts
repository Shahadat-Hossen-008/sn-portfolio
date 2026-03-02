import { defineField, defineType } from "sanity";

export const about = defineType({
    name: "about",
    title: "About",
    type: "document",
    fields: [
        defineField({
            name: "title",
            type: "string",
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "array",
            of: [{ type: "block" }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'socialLinks',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                { name: 'platform', type: 'string' },
                { name: 'url', type: 'url' }
                ]
            }]
        }),
        defineField({
            name: 'technologies',
            title: "Technologies",
            description: "Define the technologies used in the project",
            type: 'array',
            of: [{ type: 'string' }]
        })
    ],
})
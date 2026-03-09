import { ImageIcon, PresentationIcon } from "@sanity/icons";
import { format, parseISO } from 'date-fns';
import { defineField, defineType } from "sanity";

export const project = defineType({
    name: 'project',
    title: 'Projects',
    type: 'document',
    icon: PresentationIcon,
    fieldsets: [
        {
        name: 'projectDuration',
        title: 'Project Duration',
        description : 'The time period that you worked on this project.',
        options: {  columns: 2 }, 
        },
    ],
    fields:[
        defineField({
            name: 'projectTitle',
            title: 'Project Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "projectImage",
            title: "Project Image",
            type: "image",
            icon: ImageIcon,
            options: {
                hotspot: true,
            },
            fields: [
                defineField({
                    name: "link",
                    title: "Link",
                    type: "url",
                    description: " Makes the image clickable",
                }),
                defineField({
                    name: "alt",
                    title: "Alt Text",
                    type: "string",
                    description: " For accessibility, screen readers, SEO",
                }),
            ],
        }),
        defineField({
            name: 'projectDescription',
            title: 'Project Description',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            type: 'datetime',
            name: 'start',
            title: 'Start',
            fieldset: 'projectDuration',
        }),
        defineField({
            type: 'datetime',
            name: 'end',
            title: 'End',
            fieldset: 'projectDuration',
        }),
        defineField({
            name: 'projectLink',
            title: 'Project Link',
            type: 'url',
            description: 'Link to your project(only https://)',
            validation: Rule => Rule.uri({
                scheme: ['https']
            }).required()
              .error('A valid HTTPS URL is required'),
        }),
        defineField({
            name: "githubUrl",
            title: "GITHUB URL",
            description: 'Link to your github repo (only https://)',
            type: "url",
            validation: Rule => Rule.uri({
                scheme: ['https']
            }).required()
              .error('A valid HTTPS URL is required'),
        }),
        //After merge about section tag will be added
        // defineField({
        //     name: 'stack',
        //     title: 'Stack',
        //     description: 'Technologies are used in this project',
        //     type: "array",
        //     of: [{ type: "reference", to: [{ type: "tag" }] }],
        // }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'datetime',
            description: 'This date shows when the project was posted.',
            initialValue: () => new Date().toISOString(),
        }),
        
    ],
    preview: {
        select: {
            title: 'projectTitle',
            date: 'date',
            media: 'projectImage',
        },
        prepare({ title, date, media }) {
            return {
            title,
            subtitle: date ? `Posted on ${format(parseISO(date), 'LLL d, yyyy')}` : '',
            media,
            };
        },
    },
})
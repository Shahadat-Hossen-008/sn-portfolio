import {UserIcon} from '@sanity/icons'
import { defineField, defineType } from "sanity";

export const profile = defineType({
    name: 'profile',
    title: 'Profile',
    type: 'document',
    // icon: UserIcon ,
    fields: [
        defineField({
            name: 'fullName',
            title: 'Full Name',
            type: 'string',
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: 'headline',
            title: 'Headline',
            type: 'string',
            description: 'In one line, what is your role?',
            validation: (Rule) => Rule.required().max(60)
        }),
        defineField({
            name: 'bio',
            title: 'Bio',
            type: 'array',
            description: 'Write a few sentences about yourself',
            of:[{type: 'block'} ]
        }),
         defineField({
            name: 'image',
            title: 'Image',
            description: 'Upload your profile picture',
            type: 'image',
            options:{ hotspot: true }
         }),
         defineField({
            name: 'uploadCV',
            title: 'Upload CV',
            description: 'Upload your CV',
            type: 'file',
         }),
        //  defineField({
        //     name: 'contactMe',
        //     title: 'Contact Me',
        //     description: 'Add your contact details',
        //     type: 'reference',
        //     to: [{type: 'contact'}]
        //  })

    ]
})
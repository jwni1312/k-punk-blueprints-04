import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',

  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),

    defineField({
      name: 'aboutText',
      title: 'About text',
      type: 'text',
      rows: 6,
    }),

    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
    }),

    defineField({
      name: 'instagramUrl',
      title: 'Instagram link',
      type: 'url',
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'Homepage settings',
      }
    },
  },
})
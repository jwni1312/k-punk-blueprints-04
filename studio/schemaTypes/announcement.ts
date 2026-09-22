import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'announcement',
  title: 'Μήνυμα Εξ Ουρανού (Intro)',
  type: 'document',
  fields: [
    defineField({
      name: 'isActive',
      title: 'Ενεργό;',
      description: 'Αν είναι κλειστό, δεν θα εμφανιστεί καθόλου.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'message',
      title: 'Κείμενο Μηνύματος',
      type: 'text',
      rows: 3,
    }),
  ],
})
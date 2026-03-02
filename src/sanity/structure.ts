import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
import {UserIcon} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singleton Profile
      S.listItem()
        .title('Profile')
        .icon(UserIcon)                 
        .child(
          S.document()
            .schemaType('profile')
            .documentId('profileSingleton') 
        ),
      // All other document types except 'profile'
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== 'profile'
      )
    ])
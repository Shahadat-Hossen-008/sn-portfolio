import { type SchemaTypeDefinition } from 'sanity'
import { profile } from './profile'
import { blogType } from './blogType'
import { blockContentType } from './blockContentType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [profile, blogType, blockContentType],
}

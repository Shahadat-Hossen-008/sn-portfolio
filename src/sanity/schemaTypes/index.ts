import { type SchemaTypeDefinition } from 'sanity'
import { profile } from './profile'
import { project } from './project'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [profile, project],
}

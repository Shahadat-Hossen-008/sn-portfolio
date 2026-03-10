import { type SchemaTypeDefinition } from 'sanity'
import { profile } from './profile'
import { project } from './project'
import { customImage } from './customImage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [profile, project, customImage],
}

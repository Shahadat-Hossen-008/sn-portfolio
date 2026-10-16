import {
  DocumentDefinition,
  type DocumentActionComponent,
  type DocumentActionsContext,
  type SchemaTypeDefinition,
  type Template,
} from "sanity";
// Global settings
import { siteSettings } from "../global/siteSettings";
import { layout } from "../global/layout";
// Entities
import author from "../entites/author";
import blogPost from "../entites/blogPost";
import { projectTemplate } from "../entites/project";
// Hoisted objects
import portableText from "../_root/portableText";
import { customImage } from "../_root/media";
import { technologyItem } from "../_root/technology-item";
import { link } from "../_root/link";
import technologies from "../buildableSection/technologies";
import profileContent from "../buildableSection/profileContent";
import { pageSection } from "../_root/sections";
import richText from "../buildableSection/richText";
import carouselTech from "../buildableSection/carouselTech";
// pages
import { profile } from "../pages/profilePage";
import { about } from "../pages/aboutPage";
import { blogTag } from "../miscellaneous/blog-tag";
import { project } from "../pages/projectPage";
// miscellaneous
import { techTag } from "../miscellaneous/tech-tag";

/**
 * Singletons. Rendered at the very top of the Studio sidebar, pinned by
 * document id (which is the schema name), so `*[_type == "<name>"][0]` is safe
 * and exactly one document of each type can exist.
 */
export const globalSchemas: DocumentDefinition[] = [siteSettings, layout];

export const entities: DocumentDefinition[] = [
  author,
  blogPost,
  projectTemplate,
];
export const hoistedObjects: SchemaTypeDefinition[] =[
  portableText,
  customImage,
  technologyItem,

  pageSection,

  // buildable section
  profileContent,
  technologies,
  richText,
  carouselTech,
];
export const fixedPages: DocumentDefinition[] = [profile, about, project];

export const miscellaneous = [blogTag, techTag];

/**
 * Every document whose `_id` is pinned to its schema name by
 * `createSingleDocumentStructure` in `src/sanity/structure`. These are the
 * documents that must never be creatable from the "create new" menu and whose
 * destructive actions are blocked.
 */
const singletonTypeNames = new Set([
  ...globalSchemas.map((type) => type.name),
  ...fixedPages.map((type) => type.name),
]);

/**
 * `delete` and `duplicate` are destructive for a singleton: deleting removes
 * the only copy, duplicating produces a second document the GROQ `[0]` lookup
 * can never see. `unpublish` is left alone because singletons here have no
 * draft/publish split.
 */
const  BLOCKED_SINGLETON_ACTIONS = new Set(["delete", "duplicate"]);

/**
 * Singletons must never be creatable from the "create new" menu: the sidebar
 * already opens them at a fixed id. Leaving the template registered is what
 * produces duplicate site-wide documents.
 */
const withoutSingletonTemplates = (templates: Template[]): Template[] =>
  templates.filter(
    ({ schemaType }) => !singletonTypeNames.has(schemaType as string),
  );

export const schema = {
  // `link` is registered first so its `jsonType` is resolved before other
  // types (e.g. `portableText`, `project`) that reference it as an annotation
  // or field type are validated.
  types: [link, ...globalSchemas, ...entities, ...hoistedObjects, ...fixedPages, ...miscellaneous],
  templates: withoutSingletonTemplates,
};

/**
 * Blocks the destructive document actions for singletons only.
 *
 * Scoped on purpose: every other schema type keeps the stock action list, so
 * ordinary `project` and `blogPost` documents remain unaffected.
 */
export const singletonDocumentActions = (
  prev: DocumentActionComponent[],
  context: DocumentActionsContext,
): DocumentActionComponent[] => {
  if (!singletonTypeNames.has(context.schemaType)) return prev;

  return prev.filter(({ action }) => !BLOCKED_SINGLETON_ACTIONS.has(action ?? ""));
};

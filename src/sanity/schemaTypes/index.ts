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
import { PageIntroSection } from "../_root/page-intro-section";
import portableText, {
  decisionCardItem,
  decisionCards,
  editorialSection,
  mermaidDiagram,
  outcomeMetrics,
  outcomeStatItem,
  portableTable,
  portableTableCell,
  portableTableHeader,
  portableTableRow,
} from "../_root/portableText";
import { customImage } from "../_root/media";
import { technologyItem } from "../_root/technology-item";
import { heroSection } from "../buildableSection/heroSection";
import { pageSection } from "../_root/sections";
// Page Sections
import technologies from "../buildableSection/technologies";
import richText from "../buildableSection/richText";
import carouselTech from "../buildableSection/carouselTech";
import { curiositySection } from "../buildableSection/curiosity";
import { aboutBuilderSection } from "../buildableSection/aboutBuilderSection";
import { quoteSection } from "../buildableSection/quoteSection";
import { processSection } from "../buildableSection/processSection";
import { experienceSection } from "../buildableSection/experienceSection";
import { ctaSection } from "../buildableSection/ctaSection";
// Pages
import { profile } from "../pages/profilePage";
import { about } from "../pages/aboutPage";
import { project } from "../pages/projectPage";
import { blog } from "../pages/blogPage";
// Miscellaneous
import { blogTag } from "../miscellaneous/blogTag";
import { techTag } from "../miscellaneous/techTag";

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

export const sections: DocumentDefinition[] = [
  curiositySection,
  aboutBuilderSection,
  quoteSection,
  processSection,
  experienceSection,
  ctaSection,
  richText,
  technologies,
  carouselTech,
];

export const hoistedObjects: SchemaTypeDefinition[] = [
  PageIntroSection,
  portableText,
  editorialSection,
  decisionCards,
  decisionCardItem,
  outcomeMetrics,
  outcomeStatItem,
  portableTable,
  portableTableHeader,
  portableTableCell,
  portableTableRow,
  mermaidDiagram,
  customImage,
  technologyItem,
  pageSection,
  heroSection,
];

export const fixedPages: DocumentDefinition[] = [profile, about, project, blog];

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
const BLOCKED_SINGLETON_ACTIONS = new Set(["delete", "duplicate"]);

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
  types: [
    ...globalSchemas,
    ...entities,
    ...sections,
    ...hoistedObjects,
    ...fixedPages,
    ...miscellaneous,
  ],
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

  return prev.filter(
    ({ action }) => !BLOCKED_SINGLETON_ACTIONS.has(action ?? ""),
  );
};

import { isExternalHref, resolveLink } from "@/lib/sanity/links";
import { hasSanityImage } from "@/sanity/lib/images";
import { cleanText } from "@/sections/shared/section-formatting";
import { PersonalIntroSection } from "../index";
import type {
  ICapability,
  IPersonalIntroFeaturedProject,
  IPersonalIntroSectionProps,
  IPersonalIntroTiles,
  PersonalIntroData,
} from "../interface";
import type { ISanityPersonalIntroSectionProps } from "./interface";

/**
 * Extracts and filters capability items that have a non-empty title.
 */
function getCapabilities(data: PersonalIntroData): ICapability[] {
  return (data?.capabilities?.items ?? []).flatMap((item) => {
    const title = cleanText(item?.title);
    if (!title) return [];
    return [
      {
        _key: item._key,
        title,
        description: cleanText(item.description),
      },
    ];
  });
}

/**
 * Computes visibility flags for each bento tile based on data presence.
 */
function getTiles(data: PersonalIntroData): IPersonalIntroTiles {
  return {
    personalIntro: Boolean(
      cleanText(data?.personalIntro?.title) || cleanText(data?.personalIntro?.bio),
    ),
    work: Boolean(cleanText(data?.work?.project?.title)),
    learning: Boolean(cleanText(data?.learning?.title)),
    beyondCode: Boolean(
      cleanText(data?.beyondCode?.statement) ||
        (data?.beyondCode?.interests ?? []).length > 0,
    ),
    availability: Boolean(
      cleanText(data?.availability?.status) ||
        cleanText(data?.availability?.statusLabel),
    ),
  };
}

/**
 * Normalizes featured project data for the work tile.
 *
 * Resolves destination URL via priority chain:
 * 1. Dedicated project page (`/project/${slug}`)
 * 2. Case study link (if enabled)
 * 3. Direct live URL
 * 4. Fallback to `/projects` directory
 */
function getFeaturedProject(
  data: PersonalIntroData,
): IPersonalIntroFeaturedProject | null {
  const project = data?.work?.project;
  const title = cleanText(project?.title);
  if (!project || !title) return null;

  const slug = cleanText(project.slug);
  const caseStudyHref =
    project.caseStudyLink && !project.caseStudyLink.isDisabled
      ? resolveLink(project.caseStudyLink)
      : null;

  const href =
    (slug ? `/projects/${slug}` : null) ||
    caseStudyHref ||
    cleanText(project.liveLink) ||
    "/projects";

  const workImage = data?.work?.image;
  const image = hasSanityImage(workImage)
    ? workImage
    : hasSanityImage(project.image)
      ? project.image
      : null;

  return {
    _id: project._id,
    title,
    year: cleanText(project.year),
    summary: cleanText(project.summary),
    image: image ?? null,
    href,
    openInNewTab: isExternalHref(href),
  };
}

/**
 * Guard to verify if the personal intro section has any visible tiles or capabilities.
 * Shared with SectionBuilder to avoid rendering empty section wrappers.
 */
export function hasPersonalIntroContent(data?: PersonalIntroData): boolean {
  if (!data) return false;
  return (
    Object.values(getTiles(data)).some(Boolean) ||
    getCapabilities(data).length > 0
  );
}

/**
 * PersonalIntroSectionBuilder adapts Sanity CMS data into typed props
 * for the presentational PersonalIntroSection component.
 */
export function PersonalIntroSectionBuilder({
  data,
}: ISanityPersonalIntroSectionProps) {
  if (!hasPersonalIntroContent(data)) return null;

  const props: IPersonalIntroSectionProps = {
    data,
    tiles: getTiles(data),
    capabilities: getCapabilities(data),
    featuredProject: getFeaturedProject(data),
  };

  return <PersonalIntroSection {...props} />;
}

export default PersonalIntroSectionBuilder;

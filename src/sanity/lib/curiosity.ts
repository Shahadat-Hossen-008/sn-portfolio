import type {
  LATEST_PROJECTS_QUERYResult,
  PROFILE_QUERYResult,
} from "@/sanity/types";
import { resolveLink } from "@/sanity/lib/links";

export type CuriosityData = NonNullable<PROFILE_QUERYResult>["curiosity"];
export type NonNullableCuriosity = NonNullable<CuriosityData>;
export type LatestProjects = LATEST_PROJECTS_QUERYResult;
export type LatestProject = LATEST_PROJECTS_QUERYResult[number];
export type CuriosityProject = NonNullable<
  NonNullable<NonNullableCuriosity["work"]>["projects"]
>[number];

type PrimaryGroup = { items?: Array<{ isPrimary?: boolean } | null> | null } | null;

export function countPrimaryItems(groups: unknown): number {
  if (!Array.isArray(groups)) return 0;
  return (groups as PrimaryGroup[]).reduce(
    (total, group) => total + (group?.items ?? []).filter((item) => item?.isPrimary === true).length,
    0,
  );
}

export type CuriosityTileAvailability = {
  stack: boolean;
  learning: boolean;
  passion: boolean;
  interests: boolean;
  work: boolean;
};

export type CuriosityProjectRow = {
  _id: string;
  title: string;
  year: string | null;
  technologies: string[];
  href: string | null;
  openInNewTab: boolean;
};

export function projectRows(
  selectedProjects: CuriosityProject[] | null | undefined,
  latestProjects: LatestProject[] | null | undefined,
): CuriosityProjectRow[] {
  const selected = (selectedProjects ?? []).filter(Boolean).slice(0, 3);
  if (selected.length) {
    return selected.flatMap((project) => {
      const title = project.title?.trim();
      if (!title) return [];
      const technologies = (project.tech ?? []).flatMap((technology) => {
        const label = technology?.trim();
        return label ? [label] : [];
      });
      const link = project.projectLink;

      return [{
        _id: project._id,
        title,
        year: project.year?.trim() || null,
        technologies,
        href: link?.isDisabled ? null : resolveLink(link),
        openInNewTab: link?.openInNewTab === true,
      }];
    });
  }

  return (latestProjects ?? []).slice(0, 3).flatMap((project) => {
    const title = project.title?.trim();
    if (!title) return [];
    const technologies = (project.technologies ?? []).flatMap((technology) => {
      const label = technology.name?.trim();
      return label ? [label] : [];
    });
    return [{
      _id: project._id,
      title,
        year: project.date?.trim().slice(0, 4) || null,
      technologies,
      href: null,
      openInNewTab: false,
    }];
  });
}

export function getCuriosityTiles(
  data: CuriosityData,
  latestProjects: LatestProject[] | null | undefined,
): CuriosityTileAvailability {
  const groups = (data?.stack?.groups ?? []).slice(0, 4);
  const hasStack = groups.some((group) => {
    const label = group?.label?.trim();
    const hasTech = (group?.items ?? []).slice(0, 6).some((item) =>
      item?.tech?.label?.trim(),
    );
    return Boolean(label && hasTech);
  });
  const topics = (data?.learning?.topics ?? [])
    .flatMap((topic) => topic?.trim() ? [topic.trim()] : [])
    .slice(0, 3);
  const interests = (data?.interests?.items ?? [])
    .flatMap((item) => item?.trim() ? [item.trim()] : [])
    .slice(0, 5);
  const cta = data?.work?.cta;
  const hasCta = Boolean(
    cta?.label?.trim() && !cta.isDisabled && resolveLink(cta),
  );

  return {
    stack: hasStack,
    learning: topics.length > 0,
    passion: Boolean(data?.passion?.statement?.trim()),
    interests: interests.length > 0,
    work: hasCta || projectRows(data?.work?.projects, latestProjects).length > 0,
  };
}

export function getTileLayout(tiles: CuriosityTileAvailability): "designed" | "fallback" {
  return Object.values(tiles).every(Boolean) ? "designed" : "fallback";
}

export function getTypedTimings(
  topics: Array<string | null | undefined>,
): Array<{ text: string; n: number; delay: number }> {
  const cleanTopics = topics
    .flatMap((topic) => topic?.trim() ? [topic.trim()] : [])
    .slice(0, 3);
  const interval = cleanTopics.length ? 12 / cleanTopics.length : 0;

  return cleanTopics.map((text, index) => ({
    text,
    n: text.length,
    delay: 0.9 + index * interval,
  }));
}

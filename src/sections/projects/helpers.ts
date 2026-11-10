import type { IProjectItem, IProjectTag } from "./interface";

const getTagLabel = (tag?: IProjectTag | null): string =>
  tag?.label?.trim() ?? "";

/**
 * Extracts unique, non-empty technology labels across all projects.
 * Preserves first-appearance ordering and deduplicates case-insensitively.
 */
export function getProjectTags(
  projects?: ReadonlyArray<Pick<IProjectItem, "stack"> | null> | null,
): string[] {
  const uniqueTags = new Map<string, string>();

  for (const project of projects ?? []) {
    for (const tag of project?.stack ?? []) {
      const label = getTagLabel(tag);
      const key = label.toLowerCase();
      if (label && !uniqueTags.has(key)) {
        uniqueTags.set(key, label);
      }
    }
  }

  return Array.from(uniqueTags.values());
}

/**
 * Filters projects by the active technology tag (case-insensitive).
 * Returns the original project list in CMS order when `activeFilter` is `"all"`.
 */
export function filterProjectsByTag<
  T extends Pick<IProjectItem, "stack"> | null | undefined,
>(projects: ReadonlyArray<T>, activeFilter: string): ReadonlyArray<T> {
  const key = activeFilter.trim().toLowerCase();
  if (!key || key === "all") {
    return projects;
  }

  return projects.filter((project) =>
    project?.stack?.some((tag) => getTagLabel(tag).toLowerCase() === key),
  );
}

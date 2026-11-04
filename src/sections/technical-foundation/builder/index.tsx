import { TechnicalFoundationSection } from "../index";
import type {
  ITechnicalColumn,
  ITechnicalFoundationProps,
  ITechnicalSkill,
} from "../interface";
import type { ISanityTechnicalFoundationProps } from "./interface";

/**
 * Normalizes category columns from CMS data.
 * Safely filters out empty categories or categories without valid skills.
 */
function cleanColumns(
  columns?: ReadonlyArray<{
    _key?: string;
    title?: string | null;
    skills?: ReadonlyArray<
      | {
          _key?: string;
          context?: string | null;
          label?: string | null;
        }
      | string
      | null
    > | null;
  } | null> | null,
): ITechnicalColumn[] {
  if (!columns || columns.length === 0) return [];

  return columns.flatMap((col) => {
    const title = col?.title?.trim();
    if (!col || !title) return [];

    const rawSkills = col.skills ?? [];
    const skills: ITechnicalSkill[] = rawSkills.flatMap((s) => {
      if (!s) return [];
      if (typeof s === "string") {
        const trimmed = s.trim();
        return trimmed ? [{ label: trimmed }] : [];
      }
      const label = s.label?.trim();
      if (!label) return [];
      const context = s.context?.trim() || null;
      return [
        {
          _key: s._key,
          label,
          ...(context ? { context } : {}),
        },
      ];
    });

    if (skills.length === 0) return [];

    return [
      {
        _key: col._key,
        title,
        skills,
      },
    ];
  });
}

export function TechnicalFoundationSectionBuilder({
  data,
}: ISanityTechnicalFoundationProps) {
  if (!data) return null;

  const eyebrow = data.eyebrow?.trim() || "TECHNICAL FOUNDATION";
  const statement = data.statement?.trim() || "";
  const columns = cleanColumns(data.columns);

  // If there's neither a statement nor any columns, do not render an empty section
  if (!statement && columns.length === 0) {
    return null;
  }

  const props: ITechnicalFoundationProps = {
    eyebrow,
    statement,
    columns,
  };

  return <TechnicalFoundationSection {...props} />;
}

export default TechnicalFoundationSectionBuilder;

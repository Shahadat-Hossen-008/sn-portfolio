import type { PageSection } from "@/page-builder/shared/page-section";
import type { PillarColumn } from "./interface";

export type EngineeringPillarsData = Extract<
  PageSection,
  { _type: "engineeringPillars" }
>;

export type NonNullableEngineeringPillars = NonNullable<EngineeringPillarsData>;

/** Raw column item coming from Sanity schema before sanitization */
type RawPillarColumn = NonNullable<NonNullableEngineeringPillars["columns"]>[number];

/**
 * Sanitizes and trims pillar columns from Sanity for UI rendering.
 *
 * Developer Guide & Business Rules:
 * 1. Requires both a valid `label` and `statement` (non-whitespace strings).
 * 2. Filters out empty strings or non-string values from `items`.
 * 3. Trims all text fields for consistent typography and clean rendering.
 * 4. Omits `items` when the array is empty.
 */
export function cleanColumns(
  columns?: ReadonlyArray<RawPillarColumn | null> | null,
): PillarColumn[] {
  if (!columns || columns.length === 0) {
    return [];
  }

  const cleaned: PillarColumn[] = [];

  for (const column of columns) {
    if (!column) continue;

    const label = column.label?.trim();
    const statement = column.statement?.trim();

    // Both label and statement are required for a pillar column to be valid
    if (!label || !statement) continue;

    const items = (column.items ?? [])
      .filter(
        (item): item is string => typeof item === "string" && Boolean(item.trim()),
      )
      .map((item) => item.trim());

    cleaned.push({
      _key: column._key,
      label,
      statement,
      ...(items.length > 0 ? { items } : {}),
    });
  }

  return cleaned;
}

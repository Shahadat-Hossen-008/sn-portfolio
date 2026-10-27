import type { PageSection } from "@/page-builder/shared/page-section";

export type AboutBuilderData = Extract<
  PageSection,
  { _type: "aboutBuilderSection" }
>;
export type NonNullableAboutBuilder = NonNullable<AboutBuilderData>;

export type AboutNote = { _key: string; label: string; text?: string };
export type AboutFact = { _key: string; label: string; value: string };

const MAX_NOTES = 2;
const MAX_FACTS = 3;

export function cleanNotes(
  columns?: ReadonlyArray<{
    _key: string;
    label?: string | null;
    text?: string | null;
  } | null> | null,
): AboutNote[] {
  return (columns ?? [])
    .flatMap((column) => {
      const label = column?.label?.trim();
      if (!column || !label) return [];
      const text = column.text?.trim();
      return [{ _key: column._key, label, ...(text ? { text } : {}) }];
    })
    .slice(0, MAX_NOTES);
}

export function cleanFacts(
  facts?: ReadonlyArray<{
    _key: string;
    label?: string | null;
    value?: string | null;
  } | null> | null,
): AboutFact[] {
  return (facts ?? [])
    .flatMap((fact) => {
      const label = fact?.label?.trim();
      const value = fact?.value?.trim();
      if (!fact || !label || !value) return [];
      return [{ _key: fact._key, label, value }];
    })
    .slice(0, MAX_FACTS);
}

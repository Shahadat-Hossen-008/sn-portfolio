import type { ProfileSection } from "@/sanity/lib/sections";

export type AboutBuilderData = Extract<
  ProfileSection,
  { _type: "aboutBuilderSection" }
>;
export type NonNullableAboutBuilder = NonNullable<AboutBuilderData>;

export type AboutNote = { _key: string; label: string; text?: string };
export type AboutFact = { _key: string; label: string; value: string };

const MAX_NOTES = 2;
const MAX_FACTS = 3;
/** First numbered section after the hero (which is 01). */
const FIRST_NUMBERED_SECTION = 2;

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

/**
 * Section numbers are computed, never authored. Takes, in Studio order, whether
 * each numbered section will actually render; rendered ones are numbered from
 * `start`, skipped ones get `null` and consume no number.
 */
export function assignSectionNumbers(
  rendered: boolean[],
  start: number = FIRST_NUMBERED_SECTION,
): Array<number | null> {
  let next = start;
  return rendered.map((isRendered) => (isRendered ? next++ : null));
}

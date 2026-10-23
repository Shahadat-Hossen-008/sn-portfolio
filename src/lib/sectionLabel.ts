// Shared frontend utilities for section labeling
// =============================================================================
// These helpers are used by multiple section builders (about, curiosity, etc.)
// to compute consistent numbered section labels.
// =============================================================================

/** Pad a number to two digits, e.g. 3 => "03", 12 => "12" */
export function formatSectionNumber(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Build a labeled section string like "03 — About the builder".
 * If `eyebrow` is missing, empty, or only whitespace, returns `null`.
 */
export function getSectionLabel(
  number: number,
  eyebrow?: string | null,
): string | null {
  const text = eyebrow?.trim();
  if (!text) {
    return null;
  }
  return `${formatSectionNumber(number)} — ${text}`;
}

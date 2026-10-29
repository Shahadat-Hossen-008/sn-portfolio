import { isRecord } from "./sub-components/inline-components";

/**
 * Computes sequential 1-based step numbers (`1`, `2`, `3`) for an array of
 * Portable Text blocks, counting only `editorialSection` blocks that have
 * `autoNumber !== false`.
 */
export function assignEditorialSectionNumbers(
  blocks: ReadonlyArray<unknown>,
): Array<number | null> {
  let counter = 0;

  return blocks.map((block) => {
    if (!isRecord(block) || block._type !== "editorialSection") {
      return null;
    }

    if (block.autoNumber === false) {
      return null;
    }

    counter += 1;
    return counter;
  });
}

/**
 * Formats an editorial section's left label with its optional 1-based step
 * number (e.g. `01 — THE PROBLEM` or `THE PROBLEM`).
 */
export function formatEditorialLabel(
  label?: string | null,
  stepNumber?: number | null,
): string {
  const trimmed = label?.trim() ?? "";

  // If the editor already typed a leading number like "01 — THE PROBLEM",
  // respect it as-is without double-numbering.
  if (/^\d{1,2}\s*[—–-]/.test(trimmed)) {
    return trimmed;
  }

  if (stepNumber != null && stepNumber > 0) {
    const padded = String(stepNumber).padStart(2, "0");
    return trimmed ? `${padded} — ${trimmed}` : padded;
  }

  return trimmed;
}

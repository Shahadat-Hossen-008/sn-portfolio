/**
 * Pure helpers for page-section formatting (steps, dates, periods, text sanitization, and tool tags).
 * Zero GROQ, zero React.
 */
import { toPlainText } from "@portabletext/react";

export interface CleanTool {
  _id: string;
  label: string;
}

/**
 * Normalizes text input by trimming whitespace.
 * Safely guards against non-string values (e.g. legacy Portable Text block arrays).
 * Returns null if the value is missing, empty, or unparseable.
 */
export function cleanText(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (Array.isArray(value) && value.length > 0) {
    try {
      const text = toPlainText(value).trim();
      return text.length > 0 ? text : null;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Formats a 0-based step index and label into "01 — Label".
 * Returns an empty string if the label is missing or empty.
 */
export function formatStepLabel(
  index: number,
  label?: string | null,
): string {
  const trimmed = label?.trim();
  if (!trimmed) return "";
  const stepNumber = String(index + 1).padStart(2, "0");
  return `${stepNumber} — ${trimmed}`;
}

/**
 * Formats an ISO date string (e.g. "2024-01-15") to "Jan 2024" in en-US with UTC timezone.
 * Never throws, returns "" for missing or invalid dates.
 */
export function formatMonthYear(date?: string | null): string {
  if (!date || typeof date !== "string") return "";
  const trimmed = date.trim();
  if (!trimmed) return "";

  // Support YYYY, YYYY-MM, or YYYY-MM-DD
  const parsed = new Date(trimmed);
  if (isNaN(parsed.getTime())) return "";

  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
    return formatter.format(parsed);
  } catch {
    return "";
  }
}

/**
 * Formats a role duration into "Jan 2024 — Present" or "Jun 2022 — Dec 2023".
 * Returns "" when startDate is missing or invalid.
 */
export function formatPeriod(
  startDate?: string | null,
  endDate?: string | null,
  current?: boolean | null,
): string {
  const start = formatMonthYear(startDate);
  if (!start) return "";

  if (current) {
    return `${start} — Present`;
  }

  const end = formatMonthYear(endDate);
  if (end) {
    return `${start} — ${end}`;
  }

  return start;
}

/**
 * Cleans an array of technology tags (inline strings or legacy reference objects):
 * drops null items or items with null/empty labels, trims labels, caps at max 4, keeps order.
 */
export function cleanTools(
  tools?: ReadonlyArray<
    string | { _id?: string | null; label?: string | null } | null
  > | null,
): CleanTool[] {
  if (!tools || !Array.isArray(tools)) return [];

  const cleaned: CleanTool[] = [];
  for (const tool of tools) {
    if (!tool) continue;
    if (typeof tool === "string") {
      const label = tool.trim();
      if (!label) continue;
      cleaned.push({
        _id: label,
        label,
      });
    } else if (tool._id) {
      const label = tool.label?.trim();
      if (!label) continue;
      cleaned.push({
        _id: tool._id,
        label,
      });
    }
    if (cleaned.length === 4) break;
  }

  return cleaned;
}

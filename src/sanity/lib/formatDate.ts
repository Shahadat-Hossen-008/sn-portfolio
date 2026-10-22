import { format, isValid, parseISO } from "date-fns";

export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;

  const date = parseISO(value);
  return isValid(date) ? format(date, "LLL d, yyyy") : null;
}

/** Shared headline helpers used by schemas and frontend builders. */
export function splitHeadline(
  headline?: string | null,
  accent?: string | null,
): string[] {
  const text = headline ?? "";
  const emphasizedText = accent?.trim();

  if (!emphasizedText) return [text];

  const start = text.indexOf(emphasizedText);
  if (start < 0) return [text];

  const end = start + emphasizedText.length;
  return [text.slice(0, start), emphasizedText, text.slice(end)];
}

export function getInitials(fullName?: string | null): string {
  const words = fullName?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (words.length === 0) return "";

  const firstLetter = (word: string) => Array.from(word)[0] ?? "";
  if (words.length === 1) {
    return Array.from(words[0]).slice(0, 2).join("").toUpperCase();
  }

  return `${firstLetter(words[0])}${firstLetter(words[words.length - 1])}`.toUpperCase();
}

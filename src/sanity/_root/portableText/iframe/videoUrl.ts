import { canPlay } from "react-player/patterns";

const canPlaySource = Object.values(canPlay);

export function isSupportedReactPlayerUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;

  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      canPlaySource.some((matchesSource) => matchesSource(value))
    );
  } catch {
    return false;
  }
}

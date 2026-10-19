import { describe, expect, it } from "vitest";

import { isSupportedReactPlayerUrl } from "./videoUrl";

describe("isSupportedReactPlayerUrl", () => {
  it.each([
    "https://www.youtube.com/watch?v=abcdefghijk",
    "https://vimeo.com/123456",
    "https://cdn.example.com/video.mp4",
    "https://cdn.example.com/live.m3u8",
  ])("accepts supported HTTPS media sources: %s", (url) => {
    expect(isSupportedReactPlayerUrl(url)).toBe(true);
  });

  it.each([
    "javascript:alert(1)",
    "http://cdn.example.com/video.mp4",
    "https://example.com/page",
    "",
    null,
  ])("rejects unsupported or malformed sources: %s", (url) => {
    expect(isSupportedReactPlayerUrl(url)).toBe(false);
  });
});

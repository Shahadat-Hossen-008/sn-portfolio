import { describe, expect, it } from "vitest";

import { getGtmContainerId } from "@/sanity/lib/analytics";

describe("getGtmContainerId", () => {
  it("accepts a well formed container id", () => {
    expect(getGtmContainerId("GTM-ABC123")).toBe("GTM-ABC123");
    expect(getGtmContainerId("  GTM-X9  ")).toBe("GTM-X9");
  });

  it("rejects anything else so no script src is ever built from bad input", () => {
    expect(getGtmContainerId("")).toBeNull();
    expect(getGtmContainerId("   ")).toBeNull();
    expect(getGtmContainerId(null)).toBeNull();
    expect(getGtmContainerId(undefined)).toBeNull();
    expect(getGtmContainerId("gtm-abc123")).toBeNull();
    expect(getGtmContainerId("GTM-abc")).toBeNull();
    expect(getGtmContainerId("GTM-ABC<script>")).toBeNull();
    expect(getGtmContainerId("UA-12345-1")).toBeNull();
    expect(
      getGtmContainerId("https://evil.example/GTM-ABC?x="),
    ).toBeNull();
  });
});
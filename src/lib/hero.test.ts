import { describe, expect, it } from "vitest";

import { getInitials, splitHeadline } from "@/lib/hero";

describe("splitHeadline", () => {
  it("splits the first occurrence of an accent", () => {
    expect(splitHeadline("Build things that matter", "things")).toEqual([
      "Build ",
      "things",
      " that matter",
    ]);
  });

  it("returns the original headline when the accent is absent", () => {
    expect(splitHeadline("Build things", "systems")).toEqual([
      "Build things",
    ]);
  });

  it.each([undefined, "", "   "])(
    "returns the original headline for an empty accent (%s)",
    (accent) => {
      expect(splitHeadline("Build things", accent)).toEqual(["Build things"]);
    },
  );

  it("splits accents at the start and end", () => {
    expect(splitHeadline("Build useful tools", "Build")).toEqual([
      "",
      "Build",
      " useful tools",
    ]);
    expect(splitHeadline("Build useful tools", "tools")).toEqual([
      "Build useful ",
      "tools",
      "",
    ]);
  });

  it("handles missing headlines without throwing", () => {
    expect(splitHeadline(null, "Build")).toEqual([""]);
    expect(splitHeadline(undefined, "Build")).toEqual([""]);
  });
});

describe("getInitials", () => {
  it("returns initials for a multi-word name", () => {
    expect(getInitials("  Ada Lovelace  ")).toBe("AL");
    expect(getInitials("Mary Jane Watson")).toBe("MW");
  });

  it("returns up to two letters for a single-word name", () => {
    expect(getInitials("Ada")).toBe("AD");
  });

  it.each([null, undefined, "", "   "])(
    "returns an empty string for a missing name (%s)",
    (fullName) => {
      expect(getInitials(fullName)).toBe("");
    },
  );
});

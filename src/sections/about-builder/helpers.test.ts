import { describe, expect, it } from "vitest";

import { formatSectionNumber, getSectionLabel } from "@/lib/sectionLabel";
import {
  cleanFacts,
  cleanNotes,
} from "./helpers";

describe("formatSectionNumber", () => {
  it("pads to two digits", () => {
    expect(formatSectionNumber(3)).toBe("03");
    expect(formatSectionNumber(12)).toBe("12");
  });
});

describe("getSectionLabel", () => {
  it("joins number and eyebrow", () => {
    expect(getSectionLabel(3, " About the builder ")).toBe(
      "03 — About the builder",
    );
  });

  it.each([undefined, null, "", "   "])("is null for eyebrow %o", (eyebrow) => {
    expect(getSectionLabel(3, eyebrow)).toBeNull();
  });
});

describe("cleanNotes", () => {
  it("keeps at most two, trims, and drops missing labels", () => {
    const notes = cleanNotes([
      { _key: "a", label: "  One ", text: " text " },
      { _key: "b", label: "   ", text: "no label" },
      { _key: "c", label: "Two" },
      { _key: "d", label: "Three", text: "extra" },
    ]);

    expect(notes).toEqual([
      { _key: "a", label: "One", text: "text" },
      { _key: "c", label: "Two" },
    ]);
  });

  it("handles missing input", () => {
    expect(cleanNotes(undefined)).toEqual([]);
    expect(cleanNotes(null)).toEqual([]);
  });
});

describe("cleanFacts", () => {
  it("requires both label and value, trims, and caps at three", () => {
    const facts = cleanFacts([
      { _key: "a", label: " Based ", value: " Remote " },
      { _key: "b", label: "Only label", value: " " },
      { _key: "c", label: "", value: "Only value" },
      { _key: "d", label: "B", value: "2" },
      { _key: "e", label: "C", value: "3" },
      { _key: "f", label: "D", value: "4" },
    ]);

    expect(facts).toEqual([
      { _key: "a", label: "Based", value: "Remote" },
      { _key: "d", label: "B", value: "2" },
      { _key: "e", label: "C", value: "3" },
    ]);
  });
});

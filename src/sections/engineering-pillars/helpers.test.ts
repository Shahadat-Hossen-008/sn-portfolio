import { describe, expect, it } from "vitest";

import { cleanColumns } from "./helpers";

describe("cleanColumns", () => {
  it("cleans and filters columns correctly", () => {
    const columns = cleanColumns([
      {
        _key: "c1",
        label: " 01 / WHAT I CAN BRING ",
        statement: " Clean and structured code ",
        items: ["  Item 1  ", "", "  ", "Item 2"],
      },
      {
        _key: "c2",
        label: "   ",
        statement: "No label",
      },
      {
        _key: "c3",
        label: "Label without statement",
        statement: "  ",
      },
    ]);

    expect(columns).toEqual([
      {
        _key: "c1",
        label: "01 / WHAT I CAN BRING",
        statement: "Clean and structured code",
        items: ["Item 1", "Item 2"],
      },
    ]);
  });

  it("handles missing input", () => {
    expect(cleanColumns(undefined)).toEqual([]);
    expect(cleanColumns(null)).toEqual([]);
  });
});

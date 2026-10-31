import { describe, expect, it } from "vitest";

import { assignSectionNumbers } from "./numbering";

describe("assignSectionNumbers", () => {
  it("numbers rendered sections from 02", () => {
    expect(assignSectionNumbers([true, true])).toEqual([2, 3]);
  });

  it("does not number sections that will not render", () => {
    expect(assignSectionNumbers([false, true])).toEqual([null, 2]);
    expect(assignSectionNumbers([true, false, true])).toEqual([2, null, 3]);
  });
});

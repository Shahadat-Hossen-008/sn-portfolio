import { describe, expect, it } from "vitest";

import { countLabel, periodYears } from "./preview";

describe("countLabel", () => {
  it("formats 0 with plural", () => {
    expect(countLabel(0, "step")).toBe("0 steps");
  });

  it("formats 1 with singular", () => {
    expect(countLabel(1, "step")).toBe("1 step");
  });

  it("formats 2 with plural", () => {
    expect(countLabel(2, "step")).toBe("2 steps");
  });

  it("formats undefined as 0 with plural", () => {
    expect(countLabel(undefined, "step")).toBe("0 steps");
  });

  it("supports custom plural form", () => {
    expect(countLabel(2, "category", "categories")).toBe("2 categories");
  });
});

describe("periodYears", () => {
  it("formats with current flag", () => {
    expect(periodYears("2024-01-01", undefined, true)).toBe("2024 — Present");
    expect(periodYears("2024-05", "2025-01", true)).toBe("2024 — Present");
  });

  it("formats with an end date", () => {
    expect(periodYears("2022-03-01", "2024-08-15", false)).toBe("2022 — 2024");
  });

  it("formats with a missing start date", () => {
    expect(periodYears(undefined, "2022-05-01", false)).toBe("2022");
    expect(periodYears(undefined, undefined, true)).toBe("Present");
  });

  it("formats with nothing", () => {
    expect(periodYears(undefined, undefined, false)).toBe("");
    expect(periodYears()).toBe("");
  });
});

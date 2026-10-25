import { describe, expect, it } from "vitest";

import {
  cleanTools,
  formatMonthYear,
  formatPeriod,
  formatStepLabel,
} from "./aboutSections";

describe("aboutSections helpers", () => {
  describe("formatStepLabel", () => {
    it("formats 0-based index 0 as 01", () => {
      expect(formatStepLabel(0, "Understand")).toBe("01 — Understand");
    });

    it("formats 0-based index 9 as 10", () => {
      expect(formatStepLabel(9, "Deliver")).toBe("10 — Deliver");
    });

    it("returns empty string when label is empty, whitespace, null or undefined", () => {
      expect(formatStepLabel(0, "")).toBe("");
      expect(formatStepLabel(0, "   ")).toBe("");
      expect(formatStepLabel(0, null)).toBe("");
      expect(formatStepLabel(0, undefined)).toBe("");
    });

    it("trims label whitespace", () => {
      expect(formatStepLabel(2, "  Shape  ")).toBe("03 — Shape");
    });
  });

  describe("formatMonthYear", () => {
    it("formats valid ISO date strings in en-US with UTC", () => {
      expect(formatMonthYear("2024-01-15")).toBe("Jan 2024");
      expect(formatMonthYear("2022-06-01")).toBe("Jun 2022");
      expect(formatMonthYear("2023-12")).toBe("Dec 2023");
    });

    it("returns empty string for invalid dates", () => {
      expect(formatMonthYear("not-a-date")).toBe("");
      expect(formatMonthYear("2024-99-99")).toBe("");
    });

    it("returns empty string for undefined, null, or empty string", () => {
      expect(formatMonthYear(undefined)).toBe("");
      expect(formatMonthYear(null)).toBe("");
      expect(formatMonthYear("")).toBe("");
      expect(formatMonthYear("   ")).toBe("");
    });
  });

  describe("formatPeriod", () => {
    it("formats a current role with Present", () => {
      expect(formatPeriod("2024-01-01", undefined, true)).toBe("Jan 2024 — Present");
      expect(formatPeriod("2024-01-01", "2025-01-01", true)).toBe("Jan 2024 — Present");
    });

    it("formats an ended role with end date", () => {
      expect(formatPeriod("2022-06-01", "2023-12-01", false)).toBe("Jun 2022 — Dec 2023");
    });

    it("returns only start date if end date is missing and not current", () => {
      expect(formatPeriod("2022-06-01", undefined, false)).toBe("Jun 2022");
    });

    it("returns empty string when start date is missing or invalid", () => {
      expect(formatPeriod(undefined, "2023-12-01", false)).toBe("");
      expect(formatPeriod("", "2023-12-01", false)).toBe("");
      expect(formatPeriod("invalid", "2023-12-01", false)).toBe("");
      expect(formatPeriod(undefined, undefined, true)).toBe("");
    });
  });

  describe("cleanTools", () => {
    it("drops nulls, drops empty/whitespace labels, trims labels, and caps at max 4 while keeping order", () => {
      const input = [
        { _id: "t1", label: " React " },
        null,
        { _id: "t2", label: "" },
        { _id: "t3", label: "   " },
        { _id: "t4", label: null },
        { _id: "t5", label: "TypeScript" },
        { _id: "t6", label: "Next.js" },
        { _id: "t7", label: "Tailwind" },
        { _id: "t8", label: "GraphQL" }, // 5th valid tool, should be capped
      ];

      expect(cleanTools(input)).toEqual([
        { _id: "t1", label: "React" },
        { _id: "t5", label: "TypeScript" },
        { _id: "t6", label: "Next.js" },
        { _id: "t7", label: "Tailwind" },
      ]);
    });

    it("handles undefined and empty arrays", () => {
      expect(cleanTools(undefined)).toEqual([]);
      expect(cleanTools(null)).toEqual([]);
      expect(cleanTools([])).toEqual([]);
    });
  });
});

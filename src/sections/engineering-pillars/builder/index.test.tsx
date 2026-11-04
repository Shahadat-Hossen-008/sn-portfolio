import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { NonNullableEngineeringPillars } from "@/sections/engineering-pillars/helpers";
import { EngineeringPillarsSectionBuilder } from "./index";

const samplePillars: NonNullableEngineeringPillars = {
  _id: "pillars-1",
  _type: "engineeringPillars",
  title: "Engineering Pillars",
  columns: [
    {
      _key: "col1",
      label: "01 / WHAT I CAN BRING",
      statement:
        "High-performance frontend development, building scalable interfaces that bridge the gap between design and code.",
      items: [
        "Architecture of content and systems",
        "A deep focus on accessibility and performance",
        "Intent-based, maintainable component APIs",
      ],
    },
    {
      _key: "col2",
      label: "02 / HOW I WORK",
      statement:
        "I value thoughtful implementation over rushed delivery, prioritizing clarity and long-term maintainability.",
      items: [
        "Deep problem understanding before execution",
        "Direct, honest communication and steady progress",
        "A bias toward shipping the useful version first",
      ],
    },
    {
      _key: "col3",
      label: "03 / THINGS I ENJOY",
      statement:
        "Finding the intersection of technical rigor and creative expression across different mediums.",
      items: [
        "The nuances of typography and print layout",
        "Contributing to open-source developer tooling",
        "Capturing life through architectural photography",
      ],
    },
  ],
};

const render = (data: Partial<NonNullableEngineeringPillars> = {}) =>
  renderToStaticMarkup(
    <EngineeringPillarsSectionBuilder
      data={{ ...samplePillars, ...data }}
    />,
  );

describe("EngineeringPillarsSectionBuilder", () => {
  it("renders 3 pillar columns matching Screenshot 22-11-12 with numbers, statements, and italic items", () => {
    const html = render();

    expect(html).toContain("01 / WHAT I CAN BRING");
    expect(html).toContain("02 / HOW I WORK");
    expect(html).toContain("03 / THINGS I ENJOY");
    expect(html).toContain("High-performance frontend development");
    expect(html).toContain("Architecture of content and systems");
    expect(html).toContain("Deep problem understanding before execution");
    expect(html).toContain("The nuances of typography and print layout");
    expect(html).toContain("italic");
  });

  it("renders label directly as entered by editor without forced prefixing", () => {
    const html = render({
      columns: [
        {
          _key: "c1",
          label: "Core Philosophy",
          statement: "Code with intent.",
          items: ["Simplicity first"],
        },
      ],
    });

    expect(html).toContain("Core Philosophy");
    expect(html).toContain("Code with intent.");
    expect(html).toContain("Simplicity first");
  });

  it("returns empty string when data is null or columns are empty", () => {
    expect(
      renderToStaticMarkup(
        <EngineeringPillarsSectionBuilder data={null as never} />,
      ),
    ).toBe("");

    expect(render({ columns: [] })).toBe("");
    expect(render({ columns: null })).toBe("");
  });

  it("is a server component (no \"use client\")", () => {
    for (const file of ["index.tsx", "../index.tsx"]) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      expect(source).not.toMatch(/["']use client["']/);
    }
  });
});

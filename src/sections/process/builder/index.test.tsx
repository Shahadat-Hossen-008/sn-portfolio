import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { NonNullableProcessSection } from "./interface";
import { ProcessSectionBuilder } from "./index";

const base: NonNullableProcessSection = {
  _id: "proc-1",
  _type: "processSection",
  eyebrow: "Method",
  heading: "Tools follow the problem",
  headingAccent: "problem",
  intro: "How technology choices are made.",
  steps: [
    {
      _key: "s1",
      label: "Understand",
      heading: "Find the shape of the problem",
      tools: [
        { _id: "t1", label: "Figma" },
        { _id: "t2", label: "Research" },
      ],
    },
    {
      _key: "s2",
      label: "Prototype",
      heading: "Build quickly to learn",
      tools: [{ _id: "t3", label: "React" }],
    },
    {
      _key: "s3",
      label: "Architect",
      heading: "Define clean contracts",
      tools: [{ _id: "t4", label: "TypeScript" }],
    },
    {
      _key: "s4",
      label: "Build",
      heading: "Craft reliable components",
      tools: [{ _id: "t5", label: "Next.js" }],
    },
    {
      _key: "s5",
      label: "Ship",
      heading: "Verify and monitor in production",
      tools: [{ _id: "t6", label: "Vercel" }],
    },
    {
      _key: "s6",
      label: "Extra Step",
      heading: "This step should be capped",
      tools: [],
    },
  ],
};

const render = (data: Partial<NonNullableProcessSection> = {}) =>
  renderToStaticMarkup(<ProcessSectionBuilder data={{ ...base, ...data }} />);

describe("ProcessSectionBuilder", () => {
  it("renders heading with accent inside em and eyebrow", () => {
    const html = render();

    expect(html).toContain('id="process-heading"');
    expect(html).toContain("Tools follow the <em");
    expect(html).toContain("Method</p>");
  });

  it("renders plain text when accent is null", () => {
    const html = render({ headingAccent: null });

    expect(html).toContain("Tools follow the problem</h2>");
    expect(html).not.toContain("<em");
  });

  it("returns null when heading is empty or whitespace", () => {
    expect(render({ heading: "" })).toBe("");
    expect(render({ heading: "   " })).toBe("");
  });

  it("numbers steps sequentially as 01 — ..., 02 — ... and caps at 5 steps", () => {
    const html = render();

    expect(html).toContain("01 — Understand");
    expect(html).toContain("02 — Prototype");
    expect(html).toContain("03 — Architect");
    expect(html).toContain("04 — Build");
    expect(html).toContain("05 — Ship");
    expect(html).not.toContain("06 — Extra Step");
    expect(html).not.toContain("This step should be capped");
  });

  it("renders tool chips and drops null or empty tools", () => {
    const html = render({
      steps: [
        {
          _key: "step-tools",
          label: "Test Tools",
          heading: "Checking tool tags",
          tools: [
            { _id: "t1", label: "React" },
            null as never,
            { _id: "t2", label: "" },
            { _id: "t3", label: "Tailwind" },
          ],
        },
      ],
    });

    expect(html).toContain("React</li>");
    expect(html).toContain("Tailwind</li>");
  });

  it("omits empty ol when steps array is empty", () => {
    const html = render({ steps: [] });

    expect(html).not.toContain("<ol");
  });

  it("is a server component (no \"use client\")", () => {
    for (const file of ["index.tsx", "../index.tsx"]) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      expect(source).not.toMatch(/["']use client["']/);
    }
  });
});

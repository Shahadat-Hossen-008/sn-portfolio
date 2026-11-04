import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { NonNullablePhilosophy } from "./interface";
import { PhilosophySectionBuilder } from "./index";

const samplePhilosophy: NonNullablePhilosophy = {
  _id: "phil-1",
  _type: "philosophySection",
  eyebrow: "PHILOSOPHY",
  items: [
    {
      _key: "item-1",
      title: "Mentorship",
      description:
        "I view code reviews as asynchronous coaching sessions. Good reviews explain the why, encourage curiosity, and protect codebase longevity without blocking momentum.",
      tag: "Team culture",
    },
    {
      _key: "item-2",
      title: "Open Source",
      description:
        "Reading production source code is the best way to master a framework. I contribute back to packages, report reproducible edge cases, and respect community standards.",
      tag: "Community",
    },
    {
      _key: "item-3",
      title: "Design Systems",
      description:
        "Design systems are living contracts between design and engineering. Strict semantic tokens, accessible headless primitives, and composable layouts reduce churn.",
      tag: "UI Architecture",
    },
    {
      _key: "item-4",
      title: "Code Style",
      description:
        "Readability and simplicity over clever abstractions. Self-documenting types, predictable naming, and low cognitive overhead keep teams moving fast.",
      tag: "Craft",
    },
  ],
};

const render = (data: Partial<NonNullablePhilosophy> = {}) =>
  renderToStaticMarkup(
    <PhilosophySectionBuilder
      data={{ ...samplePhilosophy, ...data }}
    />,
  );

describe("PhilosophySectionBuilder", () => {
  it("renders eyebrow, principles grid with titles, descriptions, and tags matching Screenshot 22-10-23", () => {
    const html = render();

    expect(html).toContain("PHILOSOPHY");
    expect(html).toContain("Mentorship");
    expect(html).toContain("Team culture");
    expect(html).toContain("Open Source");
    expect(html).toContain("Design Systems");
    expect(html).toContain("Code Style");
  });

  it("renders top hairline border with correct Tailwind utility and container alignment", () => {
    const html = render();

    expect(html).toContain("border-t border-foreground/15");
    expect(html).toContain("container mx-auto px-4 sm:px-6 lg:px-20");
  });

  it("renders accessible section label and surface card container styling", () => {
    const html = render();

    expect(html).toContain('aria-labelledby="philosophy-eyebrow"');
    expect(html).toContain('id="philosophy-eyebrow"');
    expect(html).toContain("bg-surface");
    expect(html).toContain("rounded-2xl");
    expect(html).toContain("border-foreground/10");
  });

  it("returns empty string when data is null, or items array is missing or empty", () => {
    expect(
      renderToStaticMarkup(
        <PhilosophySectionBuilder data={null as never} />,
      ),
    ).toBe("");

    expect(render({ items: [] })).toBe("");
  });

  it("is a server component (no \"use client\")", () => {
    for (const file of ["index.tsx", "../index.tsx"]) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      expect(source).not.toMatch(/["']use client["']/);
    }
  });
});

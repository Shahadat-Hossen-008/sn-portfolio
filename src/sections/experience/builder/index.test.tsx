import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { NonNullableExperienceSection } from "./interface";
import { ExperienceSectionBuilder } from "./index";

const base: NonNullableExperienceSection = {
  _id: "exp-1",
  _type: "experienceSection",
  eyebrow: "Career",
  heading: "Crafting web experiences across teams",
  headingAccent: "teams",
  intro: "A summary of past engineering roles.",
  roles: [
    {
      _key: "r1",
      role: "Senior Frontend Engineer",
      company: "Acme Corp",
      startDate: "2024-01-01",
      endDate: null,
      current: true,
      outcome: "Led architecture migration to Next.js.",
      tools: [{ _id: "t1", label: "Next.js" }],
    },
    {
      _key: "r2",
      role: "Frontend Developer",
      company: "Beta Studio",
      startDate: "2022-06-01",
      endDate: "2023-12-01",
      current: false,
      outcome: "Built design systems and responsive components.",
      tools: [{ _id: "t2", label: "React" }],
    },
    {
      _key: "r-skip",
      role: "",
      company: "No Role Corp",
      startDate: "2021-01-01",
      endDate: null,
      current: false,
      outcome: null,
      tools: null,
    },
  ],
};

const render = (data: Partial<NonNullableExperienceSection> = {}) =>
  renderToStaticMarkup(<ExperienceSectionBuilder data={{ ...base, ...data }} />);

describe("ExperienceSectionBuilder", () => {
  it("renders heading with accent inside em and eyebrow", () => {
    const html = render();

    expect(html).toContain('id="experience-heading"');
    expect(html).toContain("across <em");
    expect(html).toContain("Career</p>");
  });

  it("renders plain text when accent is null", () => {
    const html = render({ headingAccent: null });

    expect(html).toContain("Crafting web experiences across teams</h2>");
    expect(html).not.toContain("<em");
  });

  it("returns null when heading is empty or whitespace", () => {
    expect(render({ heading: "" })).toBe("");
    expect(render({ heading: "   " })).toBe("");
  });

  it("formats periods: Jan 2024 — Present for current, Jun 2022 — Dec 2023 for past", () => {
    const html = render();

    expect(html).toContain("Jan 2024 — Present");
    expect(html).toContain("Jun 2022 — Dec 2023");
  });

  it("skips roles missing role or company", () => {
    const html = render();

    expect(html).not.toContain("No Role Corp");
  });

  it("caps at max 5 roles", () => {
    const sixRoles = Array.from({ length: 6 }, (_, i) => ({
      _key: `role-${i}`,
      role: `Role ${i}`,
      company: `Company ${i}`,
      startDate: "2020-01-01",
      endDate: "2021-01-01",
      current: false,
      outcome: "Did work",
      tools: [],
    }));

    const html = render({ roles: sixRoles });
    expect(html).toContain("Role 4");
    expect(html).not.toContain("Role 5");
  });

  it("omits ul when roles array is empty", () => {
    const html = render({ roles: [] });

    expect(html).not.toContain("<ul");
  });

  it("is a server component (no \"use client\")", () => {
    for (const file of ["index.tsx", "../index.tsx"]) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      expect(source).not.toMatch(/["']use client["']/);
    }
  });
});

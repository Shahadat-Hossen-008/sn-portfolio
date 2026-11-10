import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { NonNullableExperienceSection } from "./interface";
import { ExperienceSectionBuilder } from "./index";

const base: NonNullableExperienceSection = {
  _id: "exp-1",
  _type: "experienceSection",
  eyebrow: "Career",
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
  it("renders eyebrow and intro", () => {
    const html = render();

    expect(html).toContain('id="experience-eyebrow"');
    expect(html).toContain("Career</p>");
    expect(html).toContain("A summary of past engineering roles.");
  });

  it("returns null when roles array has no valid roles", () => {
    expect(render({ roles: [] })).toBe("");
    expect(render({ roles: [{ _key: "x", role: "", company: "" }] })).toBe("");
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

  it("renders role title and company in Urbanist font-sans", () => {
    const html = render();

    expect(html).toContain("Senior Frontend Engineer</h3>");
    expect(html).toContain("· Acme Corp</span>");
    expect(html).not.toContain("font-display text-xl");
  });

  it("renders contribution, impact, description, and project link when provided", () => {
    const customRole = [
      {
        _key: "r-rich",
        role: "Staff Engineer",
        company: "Venture Tech",
        startDate: "2023-01-01",
        endDate: null,
        current: true,
        description: "Spearheaded core platform modernization.",
        contribution: "Architected distributed caching and edge routing.",
        impact: "Cut p99 latency by 45% across 200k daily requests.",
        featured: true,
        project: {
          _id: "p1",
          title: "Platform Modernization",
          slug: "platform-modernization",
        },
        tools: [{ _id: "t1", label: "TypeScript" }],
      },
    ];

    const html = render({ roles: customRole });

    expect(html).toContain("Staff Engineer");
    expect(html).toContain("Venture Tech");
    expect(html).toContain("Spearheaded core platform modernization.");
    expect(html).toContain("Contribution");
    expect(html).toContain("Architected distributed caching and edge routing.");
    expect(html).toContain("Impact &amp; Result");
    expect(html).toContain("Cut p99 latency by 45% across 200k daily requests.");
    expect(html).toContain("Key Milestone");
    expect(html).toContain('href="/projects/platform-modernization"');
    expect(html).toContain("Case Study: Platform Modernization");
    expect(html).toContain("TypeScript");
  });

  it("gracefully falls back to outcome when impact and contribution are absent", () => {
    const fallbackRole = [
      {
        _key: "r-legacy",
        role: "Frontend Engineer",
        company: "Legacy Labs",
        startDate: "2021-01-01",
        endDate: "2022-01-01",
        current: false,
        outcome: "Delivered responsive design overhaul on schedule.",
        tools: [],
      },
    ];

    const html = render({ roles: fallbackRole });

    expect(html).toContain("Key Outcome");
    expect(html).toContain("Delivered responsive design overhaul on schedule.");
    expect(html).not.toContain("Contribution");
    expect(html).not.toContain("href=\"/projects/");
  });

  it("is a server component (no \"use client\")", () => {
    for (const file of ["index.tsx", "../index.tsx"]) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      expect(source).not.toMatch(/["']use client["']/);
    }
  });
});

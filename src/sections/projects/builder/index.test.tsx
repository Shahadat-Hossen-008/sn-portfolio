import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProjectsSectionBuilder } from "./index";
import type { SanityProjectItems } from "./interface";

const mockProjects: SanityProjectItems = [
  {
    _id: "p1",
    projectTitle: "Quantum Analytics Platform",
    slug: "quantum-analytics",
    projectType: "Web Dashboard",
    status: "shipped",
    role: "Lead Developer",
    duration: "6 Months",
    extraMeta: null,
    projectDescription:
      "High-performance data visualization tool for enterprise supply chain tracking.",
    problemStatement: null,
    start: "2024-01-01",
    end: "2024-06-01",
    liveLink: "https://quantum.example.com",
    githubUrl: "https://github.com/example/quantum",
    projectImage: null,
    stack: [
      { _id: "t1", label: "Next.js" },
      { _id: "t2", label: "TypeScript" },
    ],
  },
  {
    _id: "p2",
    projectTitle: "Artisanal Market Engine",
    slug: "artisanal-market",
    projectType: "E-Commerce",
    status: "shipped",
    role: "Architect",
    duration: "3 Months",
    extraMeta: null,
    projectDescription:
      "A headless e-commerce solution for independent designers.",
    problemStatement: null,
    start: "2023-08-01",
    end: "2023-11-01",
    liveLink: "https://market.example.com",
    githubUrl: null,
    projectImage: null,
    stack: [{ _id: "t3", label: "React" }],
  },
];

describe("ProjectsSectionBuilder", () => {
  it("renders heading and projects with alternating layout", () => {
    const html = renderToStaticMarkup(
      <ProjectsSectionBuilder
        eyebrow="SELECTED ARCHIVE"
        heading="The work lives on its own pages."
        headingAccent="pages."
        projects={mockProjects}
      />,
    );

    expect(html).toContain("SELECTED ARCHIVE");
    expect(html).toContain("The work lives on its own <em");
    expect(html).toContain("pages.</em>");
    expect(html).toContain("Quantum Analytics Platform");
    expect(html).toContain("Artisanal Market Engine");
    expect(html).toContain("Next.js");
    expect(html).toContain("TypeScript");
    expect(html).toContain('href="/projects/quantum-analytics"');
    expect(html).toContain('href="https://quantum.example.com"');
    expect(html).toContain('href="https://github.com/example/quantum"');

    // Ensure role and outcome are omitted from showcase cards
    expect(html).not.toContain("Lead Developer");
    expect(html).not.toContain("Architect");
  });

  it("returns null when projects array is empty", () => {
    const html = renderToStaticMarkup(
      <ProjectsSectionBuilder projects={[]} />,
    );
    expect(html).toBe("");
  });

  it("is a server component (no \"use client\")", () => {
    for (const file of ["index.tsx", "../index.tsx"]) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      expect(source).not.toMatch(/["']use client["']/);
    }
  });
});

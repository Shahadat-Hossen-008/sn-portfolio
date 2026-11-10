import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProjectDetailsView, resolveProjectMetadata } from "./index";
import type { ProjectDetailsData } from "./interface";

const mockProjectWithClient: ProjectDetailsData = {
  _id: "p1",
  _createdAt: "2024-01-01T00:00:00Z",
  projectTitle: "Enterprise Analytics",
  slug: "enterprise-analytics",
  projectType: "Web Dashboard",
  status: "shipped",
  role: "Lead Full-Stack Engineer",
  duration: "6 Months",
  client: "Global Logistics Inc.",
  projectDescription:
    "A high-performance data visualization platform built to transform complex supply chain metrics into actionable insights.",
  start: "2024-01-01T00:00:00Z",
  end: "2024-06-01T00:00:00Z",
  liveLink: "https://analytics.example.com",
  githubUrl: "https://github.com/example/analytics",
  projectImage: {
    imageFile: null,
    altText: "",
    isClickable: null,
    linkUrl: null,
  },
  stack: [
    { _id: "t1", label: "Next.js" },
    { _id: "t2", label: "D3.js" },
    { _id: "t3", label: "TypeScript" },
  ],
  caseStudy: [
    {
      _key: "b1",
      _type: "block",
      markDefs: null,
      children: [{ _key: "c1", _type: "span", text: "The Enterprise Analytics case study body." }],
    },
  ],
  seo: null,
};

const mockProjectWithoutClient: ProjectDetailsData = {
  ...mockProjectWithClient,
  _id: "p2",
  client: null,
  role: "Staff Architect",
  duration: "8 Months",
  projectType: "Cloud Platform",
};

describe("ProjectDetailsView", () => {
  it("renders 4-column metadata when client is present", () => {
    const items = resolveProjectMetadata(mockProjectWithClient);
    expect(items).toEqual([
      { label: "ROLE", value: "Lead Full-Stack Engineer" },
      { label: "DURATION", value: "6 Months" },
      { label: "PLATFORM", value: "Web Dashboard" },
      { label: "CLIENT", value: "Global Logistics Inc." },
    ]);

    const html = renderToStaticMarkup(
      <ProjectDetailsView project={mockProjectWithClient} />,
    );

    // Title & Description
    expect(html).toContain("Enterprise Analytics");
    expect(html).toContain("A high-performance data visualization platform");

    // Tech Tags
    expect(html).toContain("Next.js");
    expect(html).toContain("D3.js");
    expect(html).toContain("TypeScript");

    // Action links
    expect(html).toContain('href="https://analytics.example.com"');
    expect(html).toContain('href="https://github.com/example/analytics"');

    // Metadata Ribbon items
    expect(html).toContain("ROLE");
    expect(html).toContain("Lead Full-Stack Engineer");
    expect(html).toContain("DURATION");
    expect(html).toContain("6 Months");
    expect(html).toContain("PLATFORM");
    expect(html).toContain("Web Dashboard");
    expect(html).toContain("CLIENT");
    expect(html).toContain("Global Logistics Inc.");

    // Case study narrative body
    expect(html).toContain("The Enterprise Analytics case study body.");
  });

  it("renders only present fields without fallback when client is absent", () => {
    const items = resolveProjectMetadata(mockProjectWithoutClient);
    expect(items).toEqual([
      { label: "ROLE", value: "Staff Architect" },
      { label: "DURATION", value: "8 Months" },
      { label: "PLATFORM", value: "Cloud Platform" },
    ]);

    const html = renderToStaticMarkup(
      <ProjectDetailsView project={mockProjectWithoutClient} />,
    );
    expect(html).toContain("ROLE");
    expect(html).toContain("Staff Architect");
    expect(html).toContain("DURATION");
    expect(html).toContain("8 Months");
    expect(html).toContain("PLATFORM");
    expect(html).toContain("Cloud Platform");

    // Client label must NOT be rendered when client is absent
    expect(html).not.toContain("CLIENT");
    // No fallback to STATUS in the metadata ribbon
    expect(html).not.toContain("STATUS");
  });

  it("is a server component (no \"use client\")", () => {
    const source = readFileSync(new URL("./index.tsx", import.meta.url), "utf8");
    expect(source).not.toMatch(/["']use client["']/);
  });
});

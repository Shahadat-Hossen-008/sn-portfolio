import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProjectsSection } from "@/sections/projects";
import * as projectHelpers from "@/sections/projects/helpers";
import {
  filterProjectsByTag,
  getProjectTags,
} from "@/sections/projects/helpers";
import type { IProjectsSectionProps } from "@/sections/projects/interface";
import { ProjectPageBuilder } from "./index";
import type { ProjectPage, SanityProjectItems } from "./interface";

const emptyImage = {
  imageFile: null,
  altText: "",
  isClickable: null,
  linkUrl: null,
};

const mockProjects: SanityProjectItems = [
  {
    _id: "p1",
    projectTitle: "Quantum Analytics Platform",
    slug: "quantum-analytics",
    projectDescription:
      "High-performance data visualization tool for enterprise supply chain tracking.",
    start: "2024-01-01",
    end: "2024-06-01",
    liveLink: "https://quantum.example.com",
    githubUrl: "https://github.com/example/quantum",
    projectImage: emptyImage,
    stack: [
      { _id: "t1", label: "Next.js" },
      { _id: "t2", label: "TypeScript" },
    ],
  },
  {
    _id: "p2",
    projectTitle: "Artisanal Market Engine",
    slug: "artisanal-market",
    projectDescription:
      "A headless e-commerce solution for independent designers.",
    start: "2023-08-01",
    end: "2023-11-01",
    liveLink: "https://market.example.com",
    githubUrl: null,
    projectImage: emptyImage,
    stack: [
      { _id: "t3", label: "React" },
      { _id: "t4", label: "TypeScript" },
    ],
  },
];

const mockPage: ProjectPage = {
  seo: {
    title: "Projects",
    description: "Selected work",
    openGraph: null,
    robots: null,
    canonicalUrl: null,
    redirect: null,
    keywords: null,
  },
  eyebrow: "SELECTED ARCHIVE",
  heading: "The work lives on its own pages.",
  headingAccent: "pages.",
  projects: mockProjects,
  sections: null,
};

describe("ProjectPageBuilder & Project Helpers", () => {
  it("renders heading, dynamic filter buttons, and projects with alternating layout", () => {
    const html = renderToStaticMarkup(<ProjectPageBuilder page={mockPage} />);

    expect(html).toContain("SELECTED ARCHIVE");
    expect(html).toContain("The work lives on its own <em");
    expect(html).toContain("pages.</em>");
    expect(html).toContain("Quantum Analytics Platform");
    expect(html).toContain("Artisanal Market Engine");
    expect(html).toContain("ALL PROJECTS");
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain("Next.js");
    expect(html).toContain("TypeScript");
    expect(html).toContain("React");
    expect(html).toContain('href="/projects/quantum-analytics"');
    expect(html).toContain('href="https://quantum.example.com"');
    expect(html).toContain('href="https://github.com/example/quantum"');
  });

  it("assigns PROJECT_PAGE_QUERYResult['projects'] directly to IProjectsSectionProps['projects'] without type casts", () => {
    const sectionProps: IProjectsSectionProps = {
      eyebrow: mockPage.eyebrow,
      heading: mockPage.heading,
      headingAccent: mockPage.headingAccent,
      projects: mockProjects ?? [],
    };

    expect(sectionProps.projects).toHaveLength(2);
  });

  it("extracts unique dynamic tags in first-appearance order while handling case-insensitive duplicates, null entries, and empty labels", () => {
    expect(getProjectTags(null)).toEqual([]);
    expect(getProjectTags(undefined)).toEqual([]);

    const tags = getProjectTags([
      null,
      { stack: null },
      {
        stack: [
          null,
          { _id: "1", label: "Sanity" },
          { _id: "2", label: "Next.js" },
          { _id: "3", label: "   " },
          { _id: "4", label: null },
        ],
      },
      {
        stack: [
          { _id: "5", label: "next.js" },
          { _id: "6", label: "  TYPESCRIPT  " },
          { _id: "7", label: "TypeScript" },
        ],
      },
    ]);

    expect(tags).toEqual(["Sanity", "Next.js", "TYPESCRIPT"]);
  });

  it("filters projects by tag case-insensitively, handles null entries/tags, and preserves original project references and ordering", () => {
    const projects = mockProjects ?? [];

    expect(filterProjectsByTag(projects, "all")).toBe(projects);
    expect(filterProjectsByTag(projects, "  ALL  ")).toBe(projects);
    expect(filterProjectsByTag(projects, "   ")).toBe(projects);

    const nextJsMatches = filterProjectsByTag(projects, "  next.js  ");
    expect(nextJsMatches).toHaveLength(1);
    expect(nextJsMatches[0]).toBe(projects[0]);

    const reactMatches = filterProjectsByTag(projects, "React");
    expect(reactMatches).toHaveLength(1);
    expect(reactMatches[0]).toBe(projects[1]);

    const tsMatches = filterProjectsByTag(projects, "typescript");
    expect(tsMatches).toEqual([projects[0], projects[1]]);
    expect(tsMatches[0]).toBe(projects[0]);
    expect(tsMatches[1]).toBe(projects[1]);

    const sparseProjects = [
      null,
      { stack: null },
      { stack: [null, { _id: "t1", label: "   " }, { _id: "t2", label: null }] },
      projects[0],
    ];
    const sparseMatches = filterProjectsByTag(sparseProjects, "Next.js");
    expect(sparseMatches).toEqual([projects[0]]);
    expect(sparseMatches[0]).toBe(projects[0]);
  });

  it("exports only getProjectTags and filterProjectsByTag from helpers and avoids inline .toLowerCase() in ProjectsSection", () => {
    expect(Object.keys(projectHelpers).sort()).toEqual([
      "filterProjectsByTag",
      "getProjectTags",
    ]);

    const viewSource = readFileSync(
      new URL("../../../sections/projects/index.tsx", import.meta.url),
      "utf8",
    );
    expect(viewSource).not.toContain(".toLowerCase()");
  });

  it("handles Portable Text block arrays in projectDescription gracefully via cleanText", () => {
    const html = renderToStaticMarkup(
      <ProjectsSection
        projects={[
          {
            _id: "pt-1",
            projectTitle: "Portable Text Project",
            projectDescription: [
              {
                _type: "block",
                _key: "b1",
                children: [
                  {
                    _type: "span",
                    _key: "s1",
                    text: "Portable Text description fallback.",
                  },
                ],
              },
            ],
          },
        ]}
      />,
    );

    expect(html).toContain("Portable Text description fallback.");
  });

  it("omits ProjectsSection when projects array is empty", () => {
    const html = renderToStaticMarkup(
      <ProjectPageBuilder page={{ ...mockPage, projects: [] }} />,
    );
    expect(html).toBe('<main class="pt-8 pb-28"></main>');
  });

  it("keeps ProjectPageBuilder as a thin Server Component and ProjectsSection without direct Sanity query type imports", () => {
    const builderSource = readFileSync(
      new URL("index.tsx", import.meta.url),
      "utf8",
    );
    expect(builderSource).not.toMatch(/["']use client["']/);
    expect(builderSource).not.toContain("normalizeProjects");
    expect(builderSource).not.toContain("extractProjectTags");

    const viewSource = readFileSync(
      new URL("../../../sections/projects/index.tsx", import.meta.url),
      "utf8",
    );
    expect(viewSource).toMatch(/["']use client["']/);

    const interfaceSource = readFileSync(
      new URL("../../../sections/projects/interface.ts", import.meta.url),
      "utf8",
    );
    expect(interfaceSource).not.toContain("PROJECT_PAGE_QUERYResult");
    expect(interfaceSource).not.toContain("@/sanity/types");
  });
});

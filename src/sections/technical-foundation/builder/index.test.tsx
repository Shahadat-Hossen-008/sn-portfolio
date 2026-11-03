import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { NonNullableTechnicalFoundation } from "./interface";
import { TechnicalFoundationSectionBuilder } from "./index";

const sampleTechnicalFoundation: NonNullableTechnicalFoundation = {
  _id: "tf-1",
  _type: "technicalFoundation",
  eyebrow: "TECHNICAL FOUNDATION",
  statement:
    "With over 6 years of professional experience, I've developed a deep understanding of the modern web ecosystem. I specialize in building scalable, type-safe applications that prioritize the end-user experience without compromising on developer productivity.",
  columns: [
    {
      _key: "col-fe",
      title: "FRONTEND",
      skills: [
        { _key: "s1", label: "Next.js", context: "App Router" },
        { _key: "s2", label: "React 19", context: "RSC" },
        { _key: "s3", label: "TypeScript", context: null },
        { _key: "s4", label: "Tailwind CSS v4", context: null },
        { _key: "s5", label: "Framer Motion", context: null },
      ],
    },
    {
      _key: "col-be",
      title: "BACKEND",
      skills: [
        { _key: "s6", label: "Node.js", context: "Edge Runtime" },
        { _key: "s7", label: "Server Actions", context: null },
        { _key: "s8", label: "PostgreSQL", context: "Supabase" },
        { _key: "s9", label: "REST APIs", context: "Route Handlers" },
        { _key: "s10", label: "Zod", context: "Validation" },
      ],
    },
    {
      _key: "col-cms",
      title: "CMS & ARCHITECTURE",
      skills: [
        { _key: "s11", label: "Sanity CMS", context: "Headless" },
        { _key: "s12", label: "GROQ / GraphQL", context: null },
        { _key: "s13", label: "Headless Architecture", context: null },
        { _key: "s14", label: "Vercel", context: "Architecture" },
        { _key: "s15", label: "Core Web Vitals", context: null },
      ],
    },
  ],
};

const render = (data: Partial<NonNullableTechnicalFoundation> = {}) =>
  renderToStaticMarkup(
    <TechnicalFoundationSectionBuilder
      data={{ ...sampleTechnicalFoundation, ...data }}
    />,
  );

describe("TechnicalFoundationSectionBuilder", () => {
  it("renders eyebrow, lead statement, and 3 technology columns with labels and contexts matching Screenshot 22-15-44", () => {
    const html = render();

    expect(html).toContain("TECHNICAL FOUNDATION");
    expect(html).toContain("With over 6 years of professional experience");
    expect(html).toContain("FRONTEND");
    expect(html).toContain("Next.js");
    expect(html).toContain("(App Router)");
    expect(html).toContain("React 19");
    expect(html).toContain("(RSC)");
    expect(html).toContain("BACKEND");
    expect(html).toContain("PostgreSQL");
    expect(html).toContain("(Supabase)");
    expect(html).toContain("CMS &amp; ARCHITECTURE");
    expect(html).toContain("Sanity CMS");
    expect(html).toContain("(Headless)");
  });

  it("renders top hairline border with correct Tailwind utility", () => {
    const html = render();

    expect(html).toContain("border-t border-foreground/15");
  });

  it("returns empty string when data is null, or both statement and columns are missing", () => {
    expect(
      renderToStaticMarkup(
        <TechnicalFoundationSectionBuilder data={null as never} />,
      ),
    ).toBe("");

    expect(render({ statement: "", columns: [] })).toBe("");
  });

  it("is a server component (no \"use client\")", () => {
    for (const file of ["index.tsx", "../index.tsx"]) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      expect(source).not.toMatch(/["']use client["']/);
    }
  });
});

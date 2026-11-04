import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { ISanitySectionBlock } from "./interface";
import { SectionBuilder } from "./index";

const pillar = (id: string, statement: string): ISanitySectionBlock => ({
  _id: id,
  _type: "engineeringPillars",
  columns: [
    {
      _key: `col-${id}`,
      label: `01 / ${statement}`,
      statement,
      items: ["Item 1"],
    },
  ],
});

const emptyCuriosity = {
  _id: "cur",
  _type: "curiositySection",
  eyebrow: "Curious",
  heading: "Curious heading",
  headingAccent: null,
  intro: null,
  stack: null,
  learning: null,
  passion: null,
  interests: null,
  work: null,
} as ISanitySectionBlock;

describe("SectionBuilder", () => {
  it("renders nothing without sections", () => {
    expect(renderToStaticMarkup(<SectionBuilder sections={null} />)).toBe("");
  });

  it("renders the sections the editor added in order", () => {
    const html = renderToStaticMarkup(
      <SectionBuilder sections={[pillar("a", "First"), pillar("b", "Second")]} />,
    );

    expect(html.indexOf("First")).toBeLessThan(html.indexOf("Second"));
  });

  it("safely skips null, undefined, or malformed sections without throwing", () => {
    const html = renderToStaticMarkup(
      <SectionBuilder
        sections={[null, undefined, {} as never, pillar("a", "Survives")]}
      />,
    );

    expect(html).toContain("Survives");
  });

  it("does not let an empty section render", () => {
    const html = renderToStaticMarkup(
      <SectionBuilder sections={[emptyCuriosity, pillar("a", "Only")]} />,
    );

    expect(html).not.toContain("Curious heading");
    expect(html).toContain("Only");
  });

  it("ignores section types it has no component for", () => {
    const html = renderToStaticMarkup(
      <SectionBuilder
        sections={[
          { _id: "r", _type: "richTextSection" } as ISanitySectionBlock,
          pillar("a", "Kept"),
        ]}
      />,
    );

    expect(html).toContain("Kept");
  });

  it("renders About page section types in Studio order", () => {
    const sections: ISanitySectionBlock[] = [
      {
        _id: "quote",
        _type: "quoteSection",
        quote: "Quote statement",
        quoteAccent: null,
        note: "Quote note",
      },
      {
        _id: "tf",
        _type: "technicalFoundation",
        eyebrow: "TECHNICAL FOUNDATION",
        statement: "Technical foundation statement",
        columns: [
          {
            _key: "c1",
            title: "FRONTEND",
            skills: ["React"],
          },
        ],
      },
      {
        _id: "exp",
        _type: "experienceSection",
        eyebrow: "Experience eyebrow",
        intro: null,
        roles: [
          {
            _key: "r1",
            role: "Developer",
            company: "Company",
            startDate: "2024-01-01",
            endDate: null,
            current: true,
            outcome: null,
            tools: null,
          },
        ],
      },
      {
        _id: "cta",
        _type: "ctaSection",
        eyebrow: "CTA eyebrow",
        heading: "CTA heading",
        headingAccent: null,
        intro: null,
        cta: null,
      },
    ];

    const html = renderToStaticMarkup(
      <SectionBuilder sections={sections} />,
    );

    const posQuote = html.indexOf("Quote statement");
    const posTf = html.indexOf("Technical foundation statement");
    const posExp = html.indexOf("Experience eyebrow");
    const posCta = html.indexOf("CTA heading");

    expect(posQuote).toBeGreaterThan(-1);
    expect(posTf).toBeGreaterThan(posQuote);
    expect(posExp).toBeGreaterThan(posTf);
    expect(posCta).toBeGreaterThan(posExp);
  });

  it("renders multiple sections in order without numbers", () => {
    const html = renderToStaticMarkup(
      <SectionBuilder
        sections={[pillar("a", "First"), pillar("b", "Second")]}
      />,
    );

    expect(html).toContain("First");
    expect(html).toContain("Second");
  });
});

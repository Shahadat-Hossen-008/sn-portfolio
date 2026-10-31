import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { ISanitySectionBlock } from "./interface";
import { SectionBuilder } from "./index";

const about = (id: string, heading: string): ISanitySectionBlock => ({
  _id: id,
  _type: "aboutBuilderSection",
  eyebrow: "About the builder",
  heading,
  headingAccent: null,
  intro: null,
  columns: null,
  facts: null,
  cta: null,
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

  it("renders the sections the editor added, numbered from 02", () => {
    const html = renderToStaticMarkup(
      <SectionBuilder sections={[about("a", "First"), about("b", "Second")]} />,
    );

    expect(html.indexOf("First")).toBeLessThan(html.indexOf("Second"));
    expect(html).toContain("02 — About the builder");
    expect(html).toContain("03 — About the builder");
  });

  it("does not let an empty section consume a number", () => {
    const html = renderToStaticMarkup(
      <SectionBuilder sections={[emptyCuriosity, about("a", "Only")]} />,
    );

    expect(html).not.toContain("Curious heading");
    expect(html).toContain("02 — About the builder");
  });

  it("ignores section types it has no component for", () => {
    const html = renderToStaticMarkup(
      <SectionBuilder
        sections={[
          { _id: "r", _type: "richTextSection" } as ISanitySectionBlock,
          about("a", "Kept"),
        ]}
      />,
    );

    expect(html).toContain("Kept");
    expect(html).toContain("02 — About the builder");
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
        _id: "proc",
        _type: "processSection",
        eyebrow: "Process eyebrow",
        heading: "Process heading",
        headingAccent: null,
        intro: null,
        steps: [
          {
            _key: "s1",
            label: "Understand",
            heading: "Step one heading",
            tools: null,
          },
        ],
      },
      {
        _id: "exp",
        _type: "experienceSection",
        eyebrow: "Experience eyebrow",
        heading: "Experience heading",
        headingAccent: null,
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
      <SectionBuilder sections={sections} numbered={false} />,
    );

    const posQuote = html.indexOf("Quote statement");
    const posProc = html.indexOf("Process heading");
    const posExp = html.indexOf("Experience heading");
    const posCta = html.indexOf("CTA heading");

    expect(posQuote).toBeGreaterThan(-1);
    expect(posProc).toBeGreaterThan(posQuote);
    expect(posExp).toBeGreaterThan(posProc);
    expect(posCta).toBeGreaterThan(posExp);
  });

  it("gives no section numbers when numbered=false", () => {
    const html = renderToStaticMarkup(
      <SectionBuilder
        sections={[about("a", "First"), about("b", "Second")]}
        numbered={false}
      />,
    );

    expect(html).toContain("First");
    expect(html).toContain("Second");
    expect(html).not.toContain("02 —");
    expect(html).not.toContain("03 —");
  });
});

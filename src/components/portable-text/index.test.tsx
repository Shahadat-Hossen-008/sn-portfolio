import { renderToStaticMarkup } from "react-dom/server";
import { PortableText } from "next-sanity";
import { describe, expect, it } from "vitest";

import {
  CustomPortableText,
  EDITORIAL_RENDERER_CLASS,
  createPortableTextComponents,
} from "./index";
import {
  assignEditorialSectionNumbers,
  formatEditorialLabel,
} from "./numbering";

describe("assignEditorialSectionNumbers & formatEditorialLabel", () => {
  it("numbers only editorialSection blocks with autoNumber !== false", () => {
    const blocks = [
      { _type: "block", _key: "b1" },
      { _type: "editorialSection", _key: "e1", label: "THE PROBLEM" },
      { _type: "decisionCards", _key: "d1" },
      {
        _type: "editorialSection",
        _key: "e2",
        label: "UNNUMBERED",
        autoNumber: false,
      },
      { _type: "editorialSection", _key: "e3", label: "THE OUTCOME" },
    ];

    expect(assignEditorialSectionNumbers(blocks)).toEqual([
      null,
      1,
      null,
      null,
      2,
    ]);
  });

  it("formats labels with 2-digit step numbers and avoids double-numbering", () => {
    expect(formatEditorialLabel("THE PROBLEM", 1)).toBe("01 — THE PROBLEM");
    expect(formatEditorialLabel("02 — THE APPROACH", 2)).toBe(
      "02 — THE APPROACH",
    );
    expect(formatEditorialLabel("THE OUTCOME", null)).toBe("THE OUTCOME");
  });
});

describe("Editorial Portable Text components", () => {
  it("respects the available width of its parent without imposing independent max-w-reading, max-w-prose, or mx-auto restrictions", () => {
    const value = [
      {
        _type: "block",
        _key: "h1",
        style: "h2",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "hs1",
            text: "Section heading",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Shared editorial narrative content.",
            marks: [],
          },
        ],
      },
    ];

    const html = renderToStaticMarkup(
      <div className="w-full max-w-article">
        <CustomPortableText value={value as never} />
      </div>,
    );

    expect(EDITORIAL_RENDERER_CLASS).toContain("w-full");
    expect(EDITORIAL_RENDERER_CLASS).toContain("min-w-0");
    expect(EDITORIAL_RENDERER_CLASS).not.toContain("max-w-reading");
    expect(EDITORIAL_RENDERER_CLASS).not.toContain("max-w-prose");
    expect(EDITORIAL_RENDERER_CLASS).not.toContain("mx-auto");
    expect(html).toContain('data-editorial-renderer="true"');
    expect(html).toContain("w-full min-w-0 [&amp;&gt;*:first-child]:mt-0");
    expect(html).not.toContain("max-w-reading");
    expect(html).not.toContain("max-w-prose");
    expect(html).toContain("Shared editorial narrative content.");
  });

  it("renders all editorialSection blocks in a single-column reading structure with sequential numbers", () => {
    const value = [
      {
        _type: "editorialSection",
        _key: "sec-1",
        layout: "twoColumn",
        label: "THE PROBLEM",
        autoNumber: true,
        heading: "Publishing tools should not get in the way of reading.",
        body: [
          {
            _type: "block",
            _key: "p1",
            style: "normal",
            markDefs: [],
            children: [
              {
                _type: "span",
                _key: "s1",
                text: "Long-form writing deserves a quiet surface.",
                marks: [],
              },
            ],
          },
        ],
      },
      {
        _type: "decisionCards",
        _key: "dec-1",
        cards: [
          {
            _key: "c1",
            eyebrow: "DECISION",
            title: "Editor-first schema",
            description: "Content types mirror how editors think.",
          },
        ],
      },
      {
        _type: "editorialSection",
        _key: "sec-2",
        layout: "straightforward",
        label: "THE OUTCOME",
        autoNumber: true,
        heading: "What shipped and what changed.",
        body: [],
      },
      {
        _type: "outcomeState",
        _key: "out-1",
        heading: "Outcomes",
        stats: [
          {
            _key: "m1",
            value: "Walk-in ready",
            label: "Purchase without creating an account",
          },
          {
            _key: "m2",
            value: "Unified cart",
            label: "Reservations and add-ons together",
          },
        ],
      },
      {
        _type: "portableTable",
        _key: "tbl-1",
        caption: "Performance Comparison",
        columnHeaders: [
          { _key: "h1", label: "Metric" },
          { _key: "h2", label: "Result" },
        ],
        rows: [
          {
            _key: "r1",
            cells: [
              {
                _key: "cell-1",
                content: [
                  {
                    _type: "block",
                    _key: "cp1",
                    style: "normal",
                    markDefs: [],
                    children: [
                      {
                        _type: "span",
                        _key: "cs1",
                        text: "Build Time",
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                _key: "cell-2",
                content: [
                  {
                    _type: "block",
                    _key: "cp2",
                    style: "normal",
                    markDefs: [],
                    children: [
                      { _type: "span", _key: "cs2", text: "14s", marks: [] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const html = renderToStaticMarkup(
      <CustomPortableText value={value as never} />,
    );

    // Editorial Section 1: single-column structure (label above heading above body), no twoColumn grid
    expect(html).toContain('data-editorial-section="single"');
    expect(html).not.toContain('data-editorial-section="twoColumn"');
    expect(html).not.toContain("bento:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]");
    expect(html).not.toContain("bento:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]");
    expect(html).toContain("01 — THE PROBLEM");
    expect(html).toContain(
      "Publishing tools should not get in the way of reading.",
    );
    expect(html).toContain("Long-form writing deserves a quiet surface.");

    // Verify reading order: label appears before heading, heading appears before body
    const labelIndex = html.indexOf("01 — THE PROBLEM");
    const headingIndex = html.indexOf(
      "Publishing tools should not get in the way of reading.",
    );
    const bodyIndex = html.indexOf(
      "Long-form writing deserves a quiet surface.",
    );
    expect(labelIndex).toBeGreaterThan(-1);
    expect(headingIndex).toBeGreaterThan(labelIndex);
    expect(bodyIndex).toBeGreaterThan(headingIndex);

    // Decision Cards
    expect(html).toContain("DECISION");
    expect(html).toContain("Editor-first schema");
    expect(html).toContain("Content types mirror how editors think.");

    // Editorial Section 2 (numbered 02 despite intervening decisionCards)
    expect(html).toContain("02 — THE OUTCOME");
    expect(html).toContain("What shipped and what changed.");

    // Outcome Metrics
    expect(html).toContain("Outcomes");
    expect(html).toContain("Walk-in ready");
    expect(html).toContain("Purchase without creating an account");
    expect(html).toContain("gap-px border border-border bg-border");

    // Portable Table
    expect(html).toContain("Performance Comparison");
    expect(html).toContain("<table");
    expect(html).toContain("Build Time");
    expect(html).toContain("14s");
  });

  it("renders highlight marks and lists consistently in both top-level and nested editorial rich text", () => {
    const value = [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        markDefs: [],
        children: [
          { _type: "span", _key: "s1", text: "This is ", marks: [] },
          {
            _type: "span",
            _key: "s2",
            text: "highlighted text",
            marks: ["highlight"],
          },
        ],
      },
      {
        _type: "block",
        _key: "li1",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [{ _type: "span", _key: "ls1", text: "Top list item", marks: [] }],
      },
      {
        _type: "editorialSection",
        _key: "sec-1",
        body: [
          {
            _type: "block",
            _key: "p1",
            style: "normal",
            markDefs: [],
            children: [
              { _type: "span", _key: "s3", text: "Inline ", marks: [] },
              {
                _type: "span",
                _key: "s4",
                text: "inline highlight",
                marks: ["highlight"],
              },
            ],
          },
          {
            _type: "block",
            _key: "li2",
            style: "normal",
            listItem: "bullet",
            level: 1,
            markDefs: [],
            children: [
              { _type: "span", _key: "ls2", text: "Nested list item", marks: [] },
            ],
          },
        ],
      },
    ];

    const html = renderToStaticMarkup(
      <CustomPortableText value={value as never} />,
    );

    expect(html).toContain("bg-mint/35");
    expect(html).toContain("highlighted text");
    expect(html).toContain("inline highlight");
    expect(html).toContain("Top list item");
    expect(html).toContain("Nested list item");
    expect(html).toContain("w-full list-disc");
  });

  it("renders accessible syntax-highlighted code blocks and preserves the original blockquote design with attribution", () => {
    const value = [
      {
        _type: "block",
        _key: "q1",
        style: "blockquote",
        attribution: "Donald Knuth",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "qs1",
            text: "Premature optimization is the root of all evil.",
            marks: [],
          },
        ],
      },
      {
        _type: "code",
        _key: "c1",
        language: "typescript",
        filename: "src/lib/cache.ts",
        code: "export async function fetchWithCache(key: string): Promise<number> {\n  // Return cached metric\n  const ttl = 3600;\n  return ttl;\n}",
      },
    ];

    const html = renderToStaticMarkup(
      <PortableText
        value={value as never}
        components={createPortableTextComponents(value)}
      />,
    );

    // Blockquote: original design restored (rounded-2xl bg-surface border-l-2 border-mint p-6 sm:p-8 shadow-sm), full available renderer width (w-full min-w-0), attribution preserved
    expect(html).toContain('data-editorial-blockquote="true"');
    expect(html).toContain("w-full min-w-0");
    expect(html).toContain("rounded-2xl");
    expect(html).toContain("bg-surface");
    expect(html).toContain("border-l-2");
    expect(html).toContain("border-mint");
    expect(html).toContain("p-6 sm:p-8");
    expect(html).toContain("shadow-sm");
    expect(html).toContain("Premature optimization is the root of all evil.");
    expect(html).toContain("Donald Knuth");

    // Code block: full available renderer width (w-full min-w-0), accessible scroll region + syntax highlighting tokens + indentation preserved
    expect(html).toContain('data-editorial-code="true"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('role="region"');
    expect(html).toContain('aria-label="Code block: src/lib/cache.ts"');
    expect(html).toContain("whitespace-pre");
    expect(html).toContain("overflow-x-auto");
    expect(html).toContain("text-mint font-medium");
    expect(html).toContain("text-muted-sage italic");
    expect(html).toContain("fetchWithCache");
  });

  it("keeps code blocks and blockquotes aligned inside nested editorialSection blocks without col-span-2 breakouts", () => {
    const value = [
      {
        _type: "editorialSection",
        _key: "sec-code",
        layout: "twoColumn",
        label: "ARCHITECTURE",
        autoNumber: true,
        heading: "Pipeline execution",
        body: [
          {
            _type: "block",
            _key: "p1",
            style: "normal",
            markDefs: [],
            children: [
              {
                _type: "span",
                _key: "s1",
                text: "Lead explanation before code.",
                marks: [],
              },
            ],
          },
          {
            _type: "block",
            _key: "q-in-sec",
            style: "blockquote",
            markDefs: [],
            children: [
              {
                _type: "span",
                _key: "qs1",
                text: "Nested editorial quote.",
                marks: [],
              },
            ],
          },
          {
            _type: "code",
            _key: "code-in-sec",
            language: "typescript",
            code: "const pipeline = createPipeline({ concurrency: 4 });",
          },
        ],
      },
    ];

    const html = renderToStaticMarkup(
      <CustomPortableText value={value as never} />,
    );

    expect(html).toContain('data-editorial-renderer="true"');
    expect(html).toContain('data-editorial-section="single"');
    expect(html).not.toContain('data-editorial-section="twoColumn"');
    expect(html).not.toContain("bento:col-span-2");
    expect(html).toContain('data-editorial-blockquote="true"');
    expect(html).toContain('data-editorial-code="true"');
  });
});

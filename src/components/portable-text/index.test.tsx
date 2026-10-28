import { renderToStaticMarkup } from "react-dom/server";
import { PortableText } from "next-sanity";
import { describe, expect, it } from "vitest";

import { createPortableTextComponents } from "./index";
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
  it("renders two-column and straightforward editorialSection blocks with sequential numbers", () => {
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
      <PortableText
        value={value as never}
        components={createPortableTextComponents(value)}
      />,
    );

    // Editorial Section 1 (Two-column)
    expect(html).toContain("01 — THE PROBLEM");
    expect(html).toContain(
      "Publishing tools should not get in the way of reading.",
    );
    expect(html).toContain("Long-form writing deserves a quiet surface.");

    // Decision Cards
    expect(html).toContain("DECISION");
    expect(html).toContain("Editor-first schema");
    expect(html).toContain("Content types mirror how editors think.");

    // Editorial Section 2 (Straightforward, numbered 02 despite intervening decisionCards)
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
});

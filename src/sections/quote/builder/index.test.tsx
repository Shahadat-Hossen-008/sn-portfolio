import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { NonNullableQuoteSection } from "./interface";
import { QuoteSectionBuilder } from "./index";

const base: NonNullableQuoteSection = {
  _id: "quote-1",
  _type: "quoteSection",
  quote: "Simplicity is prerequisite for reliability",
  quoteAccent: "reliability",
  note: "Edsger W. Dijkstra, on computing science.",
};

const render = (data: Partial<NonNullableQuoteSection> = {}) =>
  renderToStaticMarkup(<QuoteSectionBuilder data={{ ...base, ...data }} />);

describe("QuoteSectionBuilder", () => {
  it("uses figure, blockquote and figcaption, and renders no heading element", () => {
    const html = render();

    expect(html).toContain("<figure");
    expect(html).toContain("<blockquote");
    expect(html).toContain("<figcaption");
    expect(html.match(/<h[1-6]/g)).toBeNull();
    expect(html).toMatch(/Simplicity is prerequisite for <em[^>]*>reliability<\/em>/);
  });

  it("renders decorative quote mark with aria-hidden", () => {
    const html = render();
    expect(html).toContain('<span aria-hidden="true"');
    expect(html).toContain("“</span>");
  });

  it("renders plain quote text when accent is null", () => {
    const html = render({ quoteAccent: null });

    expect(html).toContain("Simplicity is prerequisite for reliability");
    expect(html).not.toContain("<em");
  });

  it("returns null when quote is empty or whitespace", () => {
    expect(render({ quote: "" })).toBe("");
    expect(render({ quote: "   " })).toBe("");
  });

  it("omits figcaption when note is missing or null", () => {
    const html = render({ note: null });

    expect(html).not.toContain("<figcaption");
  });

  it("is a server component (no \"use client\")", () => {
    for (const file of ["index.tsx", "../index.tsx"]) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      expect(source).not.toMatch(/["']use client["']/);
    }
  });
});

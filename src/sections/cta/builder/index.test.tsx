import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { NonNullableCtaSection } from "./interface";
import { CtaSectionBuilder } from "./index";

const base: NonNullableCtaSection = {
  _id: "cta-1",
  _type: "ctaSection",
  eyebrow: "Next steps",
  heading: "Thoughtful teams, useful products",
  headingAccent: "products",
  intro: "Let's build something valuable together.",
  cta: {
    label: "Get in touch",
    type: "external",
    url: "https://example.com/contact",
    openInNewTab: true,
    isDisabled: false,
    reference: null,
  },
};

const render = (data: Partial<NonNullableCtaSection> = {}) =>
  renderToStaticMarkup(<CtaSectionBuilder data={{ ...base, ...data }} />);

describe("CtaSectionBuilder", () => {
  it("renders heading with accent inside em and eyebrow", () => {
    const html = render();

    expect(html).toContain('id="cta-heading"');
    expect(html).toContain("useful <em");
    expect(html).toContain("Next steps</p>");
  });

  it("renders plain text when accent is null", () => {
    const html = render({ headingAccent: null });

    expect(html).toContain("Thoughtful teams, useful products</h2>");
    expect(html).not.toContain("<em");
  });

  it("returns null when heading is empty or whitespace", () => {
    expect(render({ heading: "" })).toBe("");
    expect(render({ heading: "   " })).toBe("");
  });

  it("renders external CTA button with rel and target, without href='#'", () => {
    const html = render();

    expect(html).toContain('href="https://example.com/contact"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain("Get in touch");
    expect(html).toContain('<span aria-hidden="true">→</span>');
    expect(html).not.toContain('href="#"');
  });

  it("hides CTA button when link is disabled, unresolved, or missing label", () => {
    const htmlDisabled = render({
      cta: {
        label: "Disabled Button",
        type: "external",
        url: "https://example.com",
        openInNewTab: false,
        isDisabled: true,
        reference: null,
      },
    });
    expect(htmlDisabled).not.toContain("<a");
    expect(htmlDisabled).not.toContain("Disabled Button");

    const htmlUnresolved = render({
      cta: {
        label: "Broken Internal",
        type: "internal",
        url: null,
        reference: null,
        openInNewTab: false,
        isDisabled: false,
      },
    });
    expect(htmlUnresolved).not.toContain("<a");
    expect(htmlUnresolved).not.toContain("Broken Internal");

    const htmlNoLabel = render({
      cta: {
        label: "   ",
        type: "external",
        url: "https://example.com",
        openInNewTab: false,
        isDisabled: false,
        reference: null,
      },
    });
    expect(htmlNoLabel).not.toContain("<a");
  });

  it("is a server component (no \"use client\")", () => {
    for (const file of ["index.tsx", "../index.tsx"]) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      expect(source).not.toMatch(/["']use client["']/);
    }
  });
});

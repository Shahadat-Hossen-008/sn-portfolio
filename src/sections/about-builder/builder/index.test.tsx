import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { NonNullableAboutBuilder } from "@/sections/about-builder/helpers";
import { AboutBuilderSectionBuilder } from "./index";

const base: NonNullableAboutBuilder = {
  _id: "about-1",
  _type: "aboutBuilderSection",
  eyebrow: "About the builder",
  heading: "Building things that last",
  headingAccent: "things",
  intro: "An intro.",
  columns: [{ _key: "c1", label: "How", text: "Carefully" }],
  facts: [{ _key: "f1", label: "Based", value: "Somewhere" }],
  cta: null,
};

const render = (data: Partial<NonNullableAboutBuilder> = {}) =>
  renderToStaticMarkup(
    <AboutBuilderSectionBuilder data={{ ...base, ...data }} sectionNumber={3} />,
  );

const cta = (
  overrides: Partial<NonNullable<NonNullableAboutBuilder["cta"]>>,
): NonNullableAboutBuilder["cta"] => ({
  label: "Read more",
  type: "external",
  url: "https://example.com/about",
  openInNewTab: false,
  isDisabled: false,
  reference: null,
  ...overrides,
});

describe("AboutBuilderSectionBuilder", () => {
  it("renders exactly one h2 with the accent inside <em>", () => {
    const html = render();

    expect(html.match(/<h2/g)).toHaveLength(1);
    expect(html).toMatch(/Building <em[^>]*>things<\/em> that last/);
  });

  it("renders a plain heading when there is no accent", () => {
    const html = render({ headingAccent: null });

    expect(html).toContain("Building things that last</h2>");
    expect(html).not.toContain("<em");
  });

  it("renders the numbered label", () => {
    expect(render()).toContain("03 — About the builder");
  });

  it("renders no label without an eyebrow", () => {
    const html = render({ eyebrow: "  " });

    expect(html).not.toContain("03");
    expect(html).not.toContain("—");
  });

  it("renders no button and no href=\"#\" for an unresolved CTA", () => {
    const html = render({
      cta: cta({ type: "internal", url: null, reference: null }),
    });

    expect(html).not.toContain("<a");
    expect(html).not.toContain('href="#"');
  });

  it("renders no button for a disabled CTA", () => {
    const html = render({ cta: cta({ isDisabled: true }) });

    expect(html).not.toContain("<a");
  });

  it("gives an external new-tab CTA rel and target", () => {
    const html = render({ cta: cta({ openInNewTab: true }) });

    expect(html).toContain('href="https://example.com/about"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain("Read more");
  });

  it("omits the bottom row when there are no facts and no CTA", () => {
    const html = render({ facts: null, cta: null });

    expect(html).not.toContain("<dl");
    expect(html).not.toContain("pt-6");
  });

  it("keeps the bottom row when only facts exist", () => {
    expect(render({ cta: null })).toContain("<dl");
  });

  it("renders nothing for a whitespace heading", () => {
    expect(render({ heading: "   " })).toBe("");
  });

  it("resolves an internal aboutPage link to /about", () => {
    const html = render({
      cta: {
        label: "More about me",
        type: "internal",
        url: null,
        reference: { _type: "aboutPage", slug: "about" },
        openInNewTab: false,
        isDisabled: false,
      },
    });

    expect(html).toContain('href="/about"');
    expect(html).toContain("More about me");
  });

  it("is a server component (no \"use client\")", () => {
    for (const file of ["index.tsx", "../index.tsx"]) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      expect(source).not.toMatch(/["']use client["']/);
    }
  });
});

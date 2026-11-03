import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { AboutIntroData } from "./interface";
import { AboutIntroSectionBuilder } from "./index";

const base: AboutIntroData = {
  eyebrow: "The person behind the code",
  heading: "I build with care, not noise.",
  headingAccent: "care, not noise.",
  portrait: null,
  intro: "A lead sentence describing my focus.",
  body: "A short follow up paragraph about my background.",
};

const render = (data: Partial<AboutIntroData> = {}) =>
  renderToStaticMarkup(<AboutIntroSectionBuilder data={{ ...base, ...data }} />);

describe("AboutIntroSectionBuilder", () => {
  it("renders exactly one h1 with the accent inside an italic span", () => {
    const html = render();

    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain('id="about-intro-heading"');
    expect(html).toContain("font-display");
    expect(html).toMatch(/I build with <em[^>]*italic[^>]*>care, not noise\.<\/em>/);
  });

  it("renders plain text when accent is missing or null", () => {
    const html = render({ headingAccent: null });

    expect(html).toContain("I build with care, not noise.</h1>");
    expect(html).not.toContain("italic");
  });

  it("returns null when heading is empty or whitespace", () => {
    expect(render({ heading: "" })).toBe("");
    expect(render({ heading: "   " })).toBe("");
  });

  it("renders lead in text-foreground and renders body", () => {
    const html = render();

    expect(html).toContain("A lead sentence describing my focus.</p>");
    expect(html).toContain("A short follow up paragraph about my background.</p>");
  });

  it("omits eyebrow and body when empty", () => {
    const html = render({ eyebrow: null, body: null });

    expect(html).not.toContain("The person behind the code");
    expect(html).not.toContain("A short follow up paragraph");
    expect(html).toContain("A lead sentence describing my focus.");
  });

  it("renders portrait image when portrait data is provided", () => {
    const html = render({
      portrait: {
        imageFile: {
          asset: {
            _id: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg",
            url: "https://cdn.sanity.io/images/mock/test/Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000.jpg",
            metadata: {
              dimensions: {
                width: 2000,
                height: 3000,
              },
            },
          },
        },
        altText: "Custom author portrait",
      },
    });

    expect(html).toContain('alt="portfolio of Custom author portrait"');
    expect(html).toContain("rounded-2xl");
  });

  it("is a server component (no \"use client\")", () => {
    for (const file of ["index.tsx", "../index.tsx"]) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      expect(source).not.toMatch(/["']use client["']/);
    }
  });
});

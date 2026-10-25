import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { NonNullableAboutIntroSection } from "./interface";
import { AboutIntroSectionBuilder } from "./index";

const base: NonNullableAboutIntroSection = {
  _id: "intro-1",
  _type: "aboutIntroSection",
  eyebrow: "About me",
  heading: "Building interfaces with precision and care",
  headingAccent: "precision",
  intro: "A lead sentence describing my focus.",
  body: "A short follow up paragraph about my background.",
};

const render = (data: Partial<NonNullableAboutIntroSection> = {}) =>
  renderToStaticMarkup(<AboutIntroSectionBuilder data={{ ...base, ...data }} />);

describe("AboutIntroSectionBuilder", () => {
  it("renders exactly one h1 with the accent inside <em>", () => {
    const html = render();

    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain('id="about-intro-heading"');
    expect(html).toContain("font-display text-display font-normal text-balance");
    expect(html).toMatch(/with <em[^>]*>precision<\/em> and care/);
  });

  it("renders plain text when accent is missing or null", () => {
    const html = render({ headingAccent: null });

    expect(html).toContain("Building interfaces with precision and care</h1>");
    expect(html).not.toContain("<em");
  });

  it("returns null when heading is empty or whitespace", () => {
    expect(render({ heading: "" })).toBe("");
    expect(render({ heading: "   " })).toBe("");
  });

  it("renders lead in text-foreground (not muted) and renders body", () => {
    const html = render();

    expect(html).toContain('<p class="text-lead text-foreground">A lead sentence describing my focus.</p>');
    expect(html).toContain('<p class="text-base leading-[1.6] text-muted-foreground">A short follow up paragraph about my background.</p>');
  });

  it("omits eyebrow and body when empty", () => {
    const html = render({ eyebrow: null, body: null });

    expect(html).not.toContain("About me");
    expect(html).not.toContain("A short follow up paragraph");
    expect(html).toContain("A lead sentence describing my focus.");
  });

  it("is a server component (no \"use client\")", () => {
    for (const file of ["index.tsx", "../index.tsx"]) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      expect(source).not.toMatch(/["']use client["']/);
    }
  });
});

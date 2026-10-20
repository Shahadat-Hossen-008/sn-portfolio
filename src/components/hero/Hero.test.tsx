import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { HeroProps } from "@/app/types/heroProps";
import Hero from "@/components/hero/Hero";

const PORTRAIT = {
  imageFile: {
    asset: {
      _id: "image-abc123-1200x630-jpg",
      url: "https://cdn.sanity.io/images/test/production/abc123-1200x630.jpg",
      metadata: { dimensions: { width: 1200, height: 630 } },
    },
  },
  altText: "Portrait of Ada",
};

const primaryCta = {
  label: "See projects",
  type: "internal",
  reference: { _type: "blogPost", slug: "projects" },
  url: null,
  openInNewTab: null,
  isDisabled: null,
} as const;

const secondaryCta = {
  label: "Read the notes",
  type: "external",
  reference: null,
  url: "https://example.com/notes",
  openInNewTab: true,
  isDisabled: null,
} as const;

const baseHero = {
  statusLabel: "Available for work",
  location: "Dhaka",
  headline: "I build thoughtful web products",
  headlineAccent: "thoughtful",
  subline: "Designing and shipping calm, useful interfaces.",
  primaryCta,
  secondaryCta,
  portrait: null,
  nowBuilding: { title: "A portfolio refresh", progress: 72.4 },
  facts: [
    { label: "Based in", value: "Dhaka" },
    { label: "Focus", value: "Web" },
  ],
} as unknown as HeroProps["hero"];

function renderHero(
  overrides: Partial<HeroProps["hero"]> = {},
  fullName: string | null = "Ada Lovelace",
) {
  return renderToStaticMarkup(
    <Hero
      hero={{ ...baseHero, ...overrides } as HeroProps["hero"]}
      fullName={fullName}
    />,
  );
}

describe("Hero", () => {
  it("renders the accent inside an emphasized highlight", () => {
    const html = renderHero();

    expect(html).toContain("I build <em");
    expect(html).toContain("highlight-swipe");
    expect(html).toContain(">thoughtful</em>");
    expect(html).toContain("web products</h1>");
  });

  it("renders plain headline text when the accent is absent", () => {
    const html = renderHero({ headlineAccent: null });

    expect(html).toContain("I build thoughtful web products</h1>");
    expect(html).not.toContain("<em");
  });

  it("renders exactly one h1", () => {
    const html = renderHero();

    expect((html.match(/<h1/g) ?? []).length).toBe(1);
  });

  it("omits null and empty CTAs instead of rendering dead links", () => {
    const html = renderHero({
      primaryCta: null,
      secondaryCta: { ...secondaryCta, label: "" },
    });

    expect(html).not.toContain("<a ");
    expect(html).not.toContain('href="#"');
  });

  it("omits a disabled CTA while keeping the other action", () => {
    const html = renderHero({
      primaryCta: { ...primaryCta, isDisabled: true },
    });

    expect(html).not.toContain("See projects");
    expect(html).toContain("Read the notes");
  });

  it("gives external links a new-tab target and a safe rel", () => {
    const html = renderHero();

    expect(html).toContain('href="https://example.com/notes"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("hides the focus panel when there is no title and no facts", () => {
    const html = renderHero({ nowBuilding: null, facts: null });

    expect(html).not.toContain('aria-label="Current focus"');
    expect(html).not.toContain("Now building");
    expect(html).not.toContain("Build progress");
  });

  it("hides the panel when only blank facts exist", () => {
    const html = renderHero({
      nowBuilding: null,
      facts: [{ label: " ", value: " " }],
    });

    expect(html).not.toContain('aria-label="Current focus"');
  });

  it.each([
    [-5, "0"],
    [140, "100"],
    [72.4, "72"],
  ])("clamps progress %s to %s", (progress, expected) => {
    const html = renderHero({
      nowBuilding: { title: "A portfolio refresh", progress },
    });

    expect(html).toContain(`--n:${expected}`);
    expect(html).toContain(`--progress:${expected}%`);
  });

  it("hides progress when it is not a number", () => {
    const html = renderHero({
      nowBuilding: { title: "A portfolio refresh", progress: null },
    });

    expect(html).toContain("A portfolio refresh");
    expect(html).not.toContain("Build progress");
    expect(html).not.toContain("hero-count");
  });

  it("falls back to author initials when there is no portrait", () => {
    const html = renderHero({ portrait: null }, "Ada Lovelace");

    expect(html).toContain(">AL<");
    expect(html).not.toContain("<img");
  });

  it("renders the portrait with explicit dimensions when complete", () => {
    const html = renderHero({ portrait: PORTRAIT });

    expect(html).toContain("<img");
    expect(html).toContain("Portrait of Ada");
    expect(html).toContain('width="52"');
    expect(html).toContain('height="52"');
  });
});

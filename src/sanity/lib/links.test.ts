import { describe, expect, it } from "vitest";

import {
  normalizeExternalUrl,
  resolveNavHref,
  resolveNavLinks,
  type SanityNavLink,
} from "@/sanity/lib/links";

describe("normalizeExternalUrl", () => {
  it("keeps absolute URLs", () => {
    expect(normalizeExternalUrl("https://github.com/me")).toBe(
      "https://github.com/me",
    );
    expect(normalizeExternalUrl("http://example.com")).toBe(
      "http://example.com",
    );
  });

  it("keeps mailto and tel", () => {
    expect(normalizeExternalUrl("mailto:me@example.com")).toBe(
      "mailto:me@example.com",
    );
    expect(normalizeExternalUrl("tel:+15551234567")).toBe("tel:+15551234567");
  });

  it("upgrades a bare host to https", () => {
    expect(normalizeExternalUrl("github.com/me")).toBe(
      "https://github.com/me",
    );
  });

  it("rejects non-link schemes and junk", () => {
    expect(normalizeExternalUrl("javascript:alert(1)")).toBeNull();
    expect(normalizeExternalUrl("data:text/html,hi")).toBeNull();
    expect(normalizeExternalUrl("")).toBeNull();
    expect(normalizeExternalUrl("   ")).toBeNull();
    expect(normalizeExternalUrl(null)).toBeNull();
  });

  it("rejects the legacy quoted-URL values instead of repairing them", () => {
    // The dataset contains `"url": "\"https://peddy-pet-show.netlify.app/\""`.
    expect(
      normalizeExternalUrl('"https://peddy-pet-show.netlify.app/"'),
    ).toBeNull();
    expect(normalizeExternalUrl('https://example.com/a b')).toBeNull();
  });
});

describe("resolveNavHref", () => {
  it("resolves internal references through the route map", () => {
    expect(
      resolveNavHref({
        type: "internal",
        reference: { _type: "myProfilePage", slug: "" },
      }),
    ).toBe("/");
    expect(
      resolveNavHref({
        type: "internal",
        reference: { _type: "blogPost", slug: "post-1" },
      }),
    ).toBe("/blog/post-1");
  });

  it("returns null for an internal reference with no usable route", () => {
    expect(
      resolveNavHref({ type: "internal", reference: { _type: "aboutPage" } }),
    ).toBeNull();
    expect(
      resolveNavHref({ type: "internal", reference: { _type: "blogPost" } }),
    ).toBeNull();
    expect(resolveNavHref({ type: "internal" })).toBeNull();
  });

  it("resolves anchors against the site root", () => {
    expect(resolveNavHref({ type: "anchor", url: "#about" })).toBe("/#about");
    expect(resolveNavHref({ type: "anchor", url: "" })).toBeNull();
  });

  it("resolves external URLs", () => {
    expect(resolveNavHref({ type: "external", url: "github.com/me" })).toBe(
      "https://github.com/me",
    );
    expect(resolveNavHref({ type: "external" })).toBeNull();
  });

  it("returns null for an unknown or missing type", () => {
    expect(resolveNavHref({ type: "carrier-pigeon", url: "#a" })).toBeNull();
    expect(resolveNavHref({})).toBeNull();
    expect(resolveNavHref(null)).toBeNull();
  });

  it("returns null for legacy bare-string values (malformed data)", () => {
    // `projectLink` is a `link` object in the schema, but four legacy values in
    // the dataset are bare strings. They must be omitted, never guessed at.
    expect(
      resolveNavHref("https://example.com" as unknown as SanityNavLink),
    ).toBeNull();
  });
});

describe("resolveNavLinks", () => {
  it("drops unresolvable entries instead of rendering dead hrefs", () => {
    const resolved = resolveNavLinks([
      { _key: "a", label: "Home", type: "internal", reference: { _type: "myProfilePage" } },
      { _key: "b", label: "About", type: "internal", reference: { _type: "aboutPage" } },
      { _key: "c", label: "GitHub", type: "external", url: "github.com/me" },
      { _key: "d", label: "Contact", type: "anchor", url: "#contact" },
    ]);

    expect(resolved.map((link) => link.label)).toEqual([
      "Home",
      "GitHub",
      "Contact",
    ]);
    expect(resolved.map((link) => link.external)).toEqual([
      false,
      true,
      false,
    ]);
  });

  it("handles empty and missing lists", () => {
    expect(resolveNavLinks([])).toEqual([]);
    expect(resolveNavLinks(null)).toEqual([]);
    expect(resolveNavLinks(undefined)).toEqual([]);
  });
});
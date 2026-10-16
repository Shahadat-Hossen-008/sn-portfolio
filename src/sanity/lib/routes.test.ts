import { describe, expect, it } from "vitest";

import {
  anchorHref,
  absoluteUrl,
  getSiteOrigin,
  HOMEPAGE_SECTIONS,
  resolveRoute,
} from "@/sanity/lib/routes";

describe("resolveRoute", () => {
  it("maps a fixed singleton to the site root", () => {
    expect(resolveRoute("myProfilePage")).toBe("/");
    expect(resolveRoute("myProfilePage", "anything")).toBe("/");
  });

  it("maps a blog post to its detail route", () => {
    expect(resolveRoute("blogPost", "hello-world")).toBe("/blog/hello-world");
    expect(resolveRoute("blogPost", "hello#world?")).toBe(
      "/blog/hello%23world%3F",
    );
  });

  it("refuses to guess a route for a slug-less blog post", () => {
    expect(resolveRoute("blogPost")).toBeNull();
    expect(resolveRoute("blogPost", "")).toBeNull();
  });

  it("refuses document types that have no frontend route", () => {
    // aboutPage / projectPage have no route in src/app/(frontend) yet.
    expect(resolveRoute("aboutPage", "about")).toBeNull();
    expect(resolveRoute("projectPage", "project")).toBeNull();
  });

  it("refuses unknown and missing types", () => {
    expect(resolveRoute("nope")).toBeNull();
    expect(resolveRoute(null)).toBeNull();
    expect(resolveRoute(undefined)).toBeNull();
    expect(resolveRoute("")).toBeNull();
  });
});

describe("anchorHref", () => {
  it("roots a bare fragment so anchors work from every route", () => {
    expect(anchorHref("#about")).toBe("/#about");
    expect(anchorHref("#contact")).toBe("/#contact");
  });

  it("tolerates a missing hash", () => {
    expect(anchorHref("projects")).toBe("/#projects");
  });

  it("leaves already normalised and absolute values alone", () => {
    expect(anchorHref("/#about")).toBe("/#about");
    expect(anchorHref("/blog")).toBe("/blog");
    expect(anchorHref("/blog?sort=recent")).toBe("/blog?sort=recent");
    expect(anchorHref("#")).toBe("/");
  });

  it("rejects malformed or protocol-relative routes", () => {
    expect(anchorHref("//example.com")).toBeNull();
    expect(anchorHref("/\\example.com")).toBeNull();
    expect(anchorHref("/path with spaces")).toBeNull();
  });

  it("trims and rejects blank input", () => {
    expect(anchorHref("  #about  ")).toBe("/#about");
    expect(anchorHref("")).toBeNull();
    expect(anchorHref("   ")).toBeNull();
    expect(anchorHref(null)).toBeNull();
    expect(anchorHref(undefined)).toBeNull();
  });

  it("rejects anchors that are not approved homepage sections", () => {
    expect(HOMEPAGE_SECTIONS).toEqual(["about", "projects", "contact"]);
    expect(anchorHref("#nonexistent")).toBeNull();
    expect(anchorHref("pricing")).toBeNull();
    expect(anchorHref("/#nope")).toBeNull();
  });
});

describe("absoluteUrl", () => {
  it("returns null when no site origin is configured", () => {
    // `NEXT_PUBLIC_SITE_URL` is not set in the test env and the Studio preview
    // env vars point at /studio, so there is no origin to build against.
    expect(absoluteUrl("/blog/x")).toBeNull();
  });

  it("never reuses the Studio preview URL as the site origin", () => {
    process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_PRODUCTION =
      "http://localhost:3000/studio";

    try {
      expect(getSiteOrigin()).toBeNull();
    } finally {
      delete process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_PRODUCTION;
    }
  });

  it("uses NEXT_PUBLIC_SITE_URL and strips any path", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://shahadat.dev/some/path";

    try {
      expect(getSiteOrigin()).toBe("https://shahadat.dev");
      expect(absoluteUrl("/blog/x")).toBe("https://shahadat.dev/blog/x");
    } finally {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    }
  });

  it("rejects a malformed origin instead of emitting a broken one", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "not a url";

    try {
      expect(getSiteOrigin()).toBeNull();
    } finally {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    }
  });
});
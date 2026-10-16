import { describe, expect, it } from "vitest";

import {
  applyTitleTemplate,
  buildMetadata,
  getRedirectTarget,
  mergeRobots,
  parseJsonLd,
  type SiteLayoutLike,
  type SiteSettingsLike,
} from "@/sanity/lib/metadata";

const IMAGE = {
  imageFile: {
    _type: "image",
    asset: { _type: "reference", _ref: "image-abc123-1200x630-png" },
  },
  altText: "Logo",
};

const layout: SiteLayoutLike = {
  identity: {
    siteTitle: "Shahadat Hossain",
    siteDescription: "Site wide description",
    logo: IMAGE,
    favicon: null,
  },
};

const siteSettings: SiteSettingsLike = {
  seo: {
    titleTemplate: "{title} | Shahadat",
    defaultOgImage: null,
    robots: {
      disableIndex: false,
      disableFollow: false,
      disableImageIndex: false,
      disableSnippet: false,
    },
  },
};

const OFF = {
  disableIndex: false,
  disableFollow: false,
  disableImageIndex: false,
  disableSnippet: false,
};

describe("mergeRobots (site-wide OR page)", () => {
  it("indexes when neither level opts out", () => {
    expect(mergeRobots(OFF, OFF)).toEqual(OFF);
  });

  it("propagates a site-wide kill switch that a page cannot undo", () => {
    expect(mergeRobots({ ...OFF, disableIndex: true }, OFF).disableIndex).toBe(
      true,
    );
  });

  it("propagates a page-level opt-out when the site is permissive", () => {
    expect(mergeRobots(OFF, { ...OFF, disableIndex: true }).disableIndex).toBe(
      true,
    );
  });

  it("ORs each switch independently", () => {
    const merged = mergeRobots(
      { disableIndex: true, disableFollow: false },
      { disableIndex: false, disableFollow: true },
    );

    expect(merged.disableIndex).toBe(true);
    expect(merged.disableFollow).toBe(true);
  });

  it("defaults to false for missing levels (fresh document)", () => {
    expect(mergeRobots(null, null)).toEqual(OFF);
    expect(mergeRobots(undefined, undefined)).toEqual(OFF);
  });

  it("never yields a truthy non-boolean", () => {
    const merged = mergeRobots({ disableIndex: undefined }, {});
    expect(merged.disableIndex).toBe(false);
  });
});

describe("applyTitleTemplate", () => {
  it("substitutes {title}", () => {
    expect(applyTitleTemplate("{title} | Shahadat", "About")).toBe(
      "About | Shahadat",
    );
  });

  it("honours a template with no placeholder", () => {
    expect(applyTitleTemplate("Shahadat", "About")).toBe("Shahadat");
  });

  it("falls back to the bare title when the template is blank", () => {
    expect(applyTitleTemplate("", "About")).toBe("About");
    expect(applyTitleTemplate("   ", "About")).toBe("About");
    expect(applyTitleTemplate(null, "About")).toBe("About");
  });
});

describe("getRedirectTarget", () => {
  it("accepts https targets", () => {
    expect(
      getRedirectTarget({ redirect: "https://example.com/new" }),
    ).toBe("https://example.com/new");
  });

  it("rejects non-https and unparseable targets", () => {
    expect(getRedirectTarget({ redirect: "http://example.com" })).toBeNull();
    expect(getRedirectTarget({ redirect: "javascript:alert(1)" })).toBeNull();
    expect(getRedirectTarget({ redirect: "not a url" })).toBeNull();
  });

  it("returns null when no redirect is set", () => {
    expect(getRedirectTarget({ redirect: "  " })).toBeNull();
    expect(getRedirectTarget({})).toBeNull();
    expect(getRedirectTarget(null)).toBeNull();
  });
});

describe("parseJsonLd", () => {
  it("re-serialises valid objects and arrays", () => {
    expect(parseJsonLd('{ "@context": "https://schema.org" }')).toBe(
      '{"@context":"https://schema.org"}',
    );
    expect(parseJsonLd('[{"@type":"Person"}]')).toBe('[{"@type":"Person"}]');
  });

  it("accepts Sanity's code object shape", () => {
    expect(parseJsonLd({ code: '{"@type":"Person"}' })).toBe(
      '{"@type":"Person"}',
    );
  });

  it("rejects invalid JSON, scalars and blank input", () => {
    expect(parseJsonLd("{ nope")).toBeNull();
    expect(parseJsonLd("42")).toBeNull();
    expect(parseJsonLd('"a string"')).toBeNull();
    expect(parseJsonLd("null")).toBeNull();
    expect(parseJsonLd("")).toBeNull();
    expect(parseJsonLd(null)).toBeNull();
  });
});

describe("buildMetadata", () => {
  it("returns safe defaults with no settings and no page seo", () => {
    const meta = buildMetadata({ layout: null, siteSettings: null, path: "/" });

    expect(meta.title).toBe("Portfolio");
    expect(meta.robots).toMatchObject({ index: true, follow: true });
  });

  it("applies the site title template and falls back to the site description", () => {
    const meta = buildMetadata({
      layout,
      siteSettings,
      pageSeo: { title: "About" },
    });

    expect(meta.title).toBe("About | Shahadat");
    expect(meta.description).toBe("Site wide description");
  });

  it("prefers page values over the site-wide defaults", () => {
    const meta = buildMetadata({
      layout,
      siteSettings,
      pageSeo: {
        title: "About",
        description: "Page description",
        openGraph: { title: "OG About" },
      },
    });

    expect(meta.description).toBe("Page description");
    expect(meta.openGraph?.title).toBe("OG About");
  });

  it("falls back to the logo for the OG image when no default is set", () => {
    const meta = buildMetadata({
      layout,
      siteSettings,
      pageSeo: { title: "About" },
    });

    expect(meta.openGraph?.images).toHaveLength(1);
    expect(JSON.stringify(meta.openGraph?.images)).toContain("cdn.sanity.io");
  });

  it("ORs robots flags so a site-wide noindex cannot be undone", () => {
    const meta = buildMetadata({
      layout,
      siteSettings: {
        ...siteSettings,
        seo: { ...siteSettings.seo, robots: { disableIndex: true } },
      },
      pageSeo: { robots: { disableIndex: false, disableFollow: true } },
    });

    expect(meta.robots).toMatchObject({
      index: false,
      follow: false,
      nosnippet: undefined,
    });
  });

  it("omits canonical when no site origin is configured", () => {
    const meta = buildMetadata({ layout, siteSettings, path: "/blog/x" });

    expect(meta.alternates?.canonical).toBeUndefined();
    expect(meta.metadataBase).toBeUndefined();
  });

  it("uses an explicit canonical when the editor sets one", () => {
    const meta = buildMetadata({
      layout,
      siteSettings,
      pageSeo: { canonicalUrl: "https://example.com/explicit" },
    });

    expect(meta.alternates?.canonical).toBe("https://example.com/explicit");
  });

  it("never emits a redirect through metadata", () => {
    const meta = buildMetadata({
      layout,
      siteSettings,
      pageSeo: { redirect: "https://example.com/new" },
    });

    expect(JSON.stringify(meta)).not.toContain("example.com/new");
  });
});

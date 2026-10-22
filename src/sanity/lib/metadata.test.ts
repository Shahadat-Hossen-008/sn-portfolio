import { describe, expect, it } from "vitest";
import { createSchema } from "sanity";

import {
  applyTitleTemplate,
  buildMetadata,
  getRedirectTarget,
  mergeRobots,
  type SiteLayoutLike,
  type SiteSettingsLike,
} from "@/sanity/lib/metadata";
import {
  LINK_TYPES,
  normalizeExternalUrl,
  resolveLink,
  type SanityLink,
} from "@/sanity/lib/links";
import { absoluteUrl, getSiteOrigin, resolveRoute } from "@/sanity/lib/routes";
import { link } from "@/sanity/_root/link";

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

describe("buildMetadata", () => {
  it("returns safe defaults with no settings and no page seo", () => {
    const meta = buildMetadata({ layout: null, siteSettings: null, path: "/" });

    expect(meta.title).toBe("Portfolio");
    expect(meta.robots).toMatchObject({ index: true, follow: true });
  });

  it("still builds metadata when only one singleton is present", () => {
    const layoutOnly = buildMetadata({
      layout,
      siteSettings: null,
      pageSeo: { title: "About" },
    });
    const settingsOnly = buildMetadata({
      layout: null,
      siteSettings,
      pageSeo: { title: "About" },
    });

    expect(layoutOnly.title).toBe("About");
    expect(settingsOnly.title).toBe("About");
    expect(settingsOnly.robots).toMatchObject({ index: true, follow: true });
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

  it("builds a canonical from the public origin, never the Studio path", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://shahadat.dev";
    process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_PRODUCTION =
      "https://shahadat.dev/studio";

    try {
      const meta = buildMetadata({ layout, siteSettings, path: "/blog/hello" });

      expect(meta.alternates?.canonical).toBe(
        "https://shahadat.dev/blog/hello",
      );
      expect(JSON.stringify(meta)).not.toContain("/studio");
    } finally {
      delete process.env.NEXT_PUBLIC_SITE_URL;
      delete process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_PRODUCTION;
    }
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


describe("public route resolution", () => {
  it("resolves implemented routes and rejects missing frontend routes", () => {
    expect(resolveRoute("myProfilePage")).toBe("/");
    expect(resolveRoute("blogPost", "hello-world")).toBe(
      "/blog/hello-world",
    );
    expect(resolveRoute("aboutPage", "about")).toBeNull();
    expect(resolveRoute("projectPage", "project")).toBeNull();
    expect(resolveRoute("blogPost")).toBeNull();
    expect(resolveRoute("unknownType")).toBeNull();
  });

});

describe("link resolution", () => {
  it("exposes a reusable object field factory with only two supported kinds", () => {
    const linkField = link();

    expect(LINK_TYPES).toEqual(["internal", "external"]);
    expect(linkField).toMatchObject({ name: "link", type: "object" });
    expect(
      (linkField as { fields?: { name: string; options?: { list?: string[] } }[] })
        .fields?.find((field) => field.name === "type")?.options?.list,
    ).toEqual(["internal", "external"]);
    expect(() =>
      createSchema({ name: "link-factory-test", types: [linkField] }),
    ).not.toThrow();
  });

  it("supports internal links and external URLs, including same-site URLs", () => {
    expect(
      resolveLink({
        type: "internal",
        reference: { _type: "blogPost", slug: "post-1" },
      }),
    ).toBe("/blog/post-1");
    expect(
      resolveLink({ type: "external", url: "https://mysite.com/about" }),
    ).toBe("https://mysite.com/about");
    expect(resolveLink({ type: "external", url: "github.com/me" })).toBe(
      "https://github.com/me",
    );
  });

  it("rejects invalid destinations instead of producing broken hrefs", () => {
    expect(resolveLink({ type: "internal", reference: { _type: "aboutPage" } })).toBeNull();
    expect(resolveLink({ type: "external", url: "javascript:alert(1)" })).toBeNull();
    expect(resolveLink({ type: "external", url: "#unknown" })).toBeNull();
    expect(resolveLink({ type: "external", url: null })).toBeNull();
    expect(resolveLink({})).toBeNull();
    expect(normalizeExternalUrl('"https://example.com/"')).toBeNull();
    expect(
      resolveLink("https://example.com" as unknown as SanityLink),
    ).toBeNull();
  });

  it("drops unresolved entries from link lists", () => {
    const links = ([
      { label: "Home", type: "internal", reference: { _type: "myProfilePage" } },
      { label: "Missing", type: "internal", reference: { _type: "aboutPage" } },
      { label: "Contact", type: "external", url: "https://mysite.com/contact", isDisabled: true },
    ] satisfies SanityLink[]).flatMap((link) => {
      const href = resolveLink(link);
      return href ? [{ ...link, href }] : [];
    });

    expect(links.map(({ label }) => label)).toEqual(["Home", "Contact"]);
    expect(links[1]?.isDisabled).toBe(true);
    expect(links.some(({ href }) => href === "#")).toBe(false);
  });
});

describe("public route origin", () => {
  it("does not use the Studio preview URL as a public origin", () => {
    process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_PRODUCTION =
      "http://localhost:3000/studio";

    try {
      expect(getSiteOrigin()).toBeNull();
    } finally {
      delete process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_PRODUCTION;
    }
  });

  it("builds absolute public paths from NEXT_PUBLIC_SITE_URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://shahadat.dev/some/path";

    try {
      expect(absoluteUrl("/blog/hello")).toBe(
        "https://shahadat.dev/blog/hello",
      );
    } finally {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    }
  });
});

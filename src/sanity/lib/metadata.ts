import type { Metadata } from "next";

import { urlFor } from "./image";
import { absoluteUrl, getSiteOrigin } from "./routes";
import type { SanityImageRef } from "./images";

/** The four switches produced by `seo().robots` and `siteSettings.seo.robots`. */
export type RobotsFlags = {
  disableIndex?: boolean | null;
  disableFollow?: boolean | null;
  disableImageIndex?: boolean | null;
  disableSnippet?: boolean | null;
};

export type PageSeo = {
  title?: string | null;
  description?: string | null;
  openGraph?: {
    title?: string | null;
    description?: string | null;
    image?: SanityImageRef;
  } | null;
  robots?: RobotsFlags | null;
  canonicalUrl?: string | null;
  redirect?: string | null;
  keywords?: string[] | null;
} | null;

export type BuildMetadataArgs = {
  layout?: SiteLayoutLike | null;
  siteSettings?: SiteSettingsLike | null;
  pageSeo?: PageSeo;
  /** Path of the current route, e.g. `/blog/hello`. Used for self-canonicals. */
  path?: string;
};

export type SiteLayoutLike = {
  identity?: {
    siteTitle?: string | null;
    siteDescription?: string | null;
    logo?: SanityImageRef;
    favicon?: { asset?: unknown } | null;
  } | null;
};

export type SiteSettingsLike = {
  seo?: {
    titleTemplate?: string | null;
    defaultOgImage?: SanityImageRef;
    robots?: RobotsFlags | null;
  } | null;
};

const DEFAULT_TITLE_TEMPLATE = "{title}";

/**
 * Applies the site-wide title template.
 *
 * A template without `{title}` is honoured literally (so an editor can pin an
 * exact title), and an empty template falls back to `{title}` rather than
 * producing an empty `<title>`.
 */
export function applyTitleTemplate(
  template: string | null | undefined,
  title: string,
): string {
  const safeTemplate = template?.trim() || DEFAULT_TITLE_TEMPLATE;

  return safeTemplate.replace("{title}", title);
}

/**
 * Global ← page precedence, robots switch by switch.
 *
 * Rule: **OR**. If either level turns a switch on, the page is blocked. A
 * site-wide `noindex` kill switch therefore cannot be undone by a page, which
 * is the whole point of having a site-wide switch.
 */
export function mergeRobots(
  global: RobotsFlags | null | undefined,
  page: RobotsFlags | null | undefined,
): RobotsFlags {
  return {
    disableIndex: Boolean(global?.disableIndex) || Boolean(page?.disableIndex),
    disableFollow: Boolean(global?.disableFollow) || Boolean(page?.disableFollow),
    disableImageIndex:
      Boolean(global?.disableImageIndex) || Boolean(page?.disableImageIndex),
    disableSnippet:
      Boolean(global?.disableSnippet) || Boolean(page?.disableSnippet),
  };
}

function imageUrl(image: SanityImageRef | null | undefined): string | null {
  if (!image?.imageFile) return null;

  try {
    return urlFor(image.imageFile).width(1200).height(630).fit("crop").url();
  } catch {
    return null;
  }
}

function faviconUrl(
  image: { asset?: unknown } | null | undefined,
): string | null {
  if (!image?.asset) return null;

  try {
    return urlFor(image.asset as never).width(64).height(64).url();
  } catch {
    return null;
  }
}

/**
 * Builds Next.js `Metadata` for any route.
 *
 * Precedence, highest first: page `seo` → site-wide `siteSettings` → built-in
 * defaults. Passing no `settings` and no `pageSeo` still returns valid metadata
 * (that is the state before `siteSettings` exists in the dataset).
 *
 * Redirects are deliberately **not** handled here — see `getRedirectTarget`.
 */
export function buildMetadata({
  layout,
  siteSettings,
  pageSeo,
  path = "/",
}: BuildMetadataArgs): Metadata {
  const identity = layout?.identity;
  const siteSeo = siteSettings?.seo;

  const siteTitle = identity?.siteTitle?.trim() || "";
  const rawTitle = pageSeo?.title?.trim() || siteTitle || "Portfolio";

  const description =
    pageSeo?.description?.trim() || identity?.siteDescription?.trim() || "";

  const template = siteSeo?.titleTemplate ?? DEFAULT_TITLE_TEMPLATE;
  const title = siteTitle ? applyTitleTemplate(template, rawTitle) : rawTitle;

  const ogTitle = pageSeo?.openGraph?.title?.trim() || rawTitle;
  const ogDescription =
    pageSeo?.openGraph?.description?.trim() || description;

  const ogImage =
    imageUrl(pageSeo?.openGraph?.image) ??
    imageUrl(siteSeo?.defaultOgImage) ??
    imageUrl(identity?.logo);

  const robots = mergeRobots(siteSeo?.robots, pageSeo?.robots);

  const canonical = pageSeo?.canonicalUrl?.trim() || absoluteUrl(path);

  const icons = faviconUrl(identity?.favicon) ?? imageUrl(identity?.logo);

  const origin = getSiteOrigin();

  return {
    title,
    description,
    ...(origin ? { metadataBase: new URL(origin) } : {}),
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(pageSeo?.keywords?.length
      ? { keywords: [...new Set(pageSeo.keywords)] }
      : {}),
    openGraph: {
      type: "website",
      title: ogTitle,
      description: ogDescription,
      url: canonical ?? undefined,
      ...(siteTitle ? { siteName: siteTitle } : {}),
      ...(ogImage ? { images: [{ url: ogImage, alt: ogTitle }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: ogTitle,
      description: ogDescription,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: {
      index: !robots.disableIndex,
      follow: !robots.disableFollow,
      noimageindex: robots.disableImageIndex || undefined,
      nosnippet: robots.disableSnippet || undefined,
    },
    ...(icons ? { icons: { icon: [icons], apple: [icons] } } : {}),
  };
}

/**
 * Returns the redirect target for a document, or `null`.
 *
 * Kept separate from `buildMetadata` on purpose: `buildMetadata` is a pure
 * mapper and is called from `generateMetadata`, where throwing would surface as
 * a metadata error. Callers invoke this first and use `next/navigation`'s
 * `redirect()` explicitly, which is auditable at the call site.
 *
 * Only `https:` targets are honoured — the schema restricts the field, and a
 * second check keeps a hand-edited document from turning into an open redirect
 * to `javascript:` or `data:`.
 */
export function getRedirectTarget(
  pageSeo: PageSeo | null | undefined,
): string | null {
  const target = pageSeo?.redirect?.trim();

  if (!target) return null;

  try {
    return new URL(target).protocol === "https:" ? target : null;
  } catch {
    return null;
  }
}

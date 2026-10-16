import type { LAYOUT_QUERYResult, SITE_SETTINGS_QUERYResult } from "@/sanity/types";

/**
 * Props bags for everything rendered from the site-wide settings singletons.
 *
 * Derived from `LAYOUT_QUERYResult` / `SITE_SETTINGS_QUERYResult`, so a GROQ
 * projection change surfaces here at compile time instead of at runtime.
 *
 * Both bags are nullable on purpose: `layout` and `siteSettings` are Studio
 * documents that do not exist until someone creates them. Every consumer must
 * handle `null` rather than assume the site is configured.
 */
export type Layout = LAYOUT_QUERYResult;
export type SiteSettings = SITE_SETTINGS_QUERYResult;

export type SiteIdentity = NonNullable<Layout>["identity"];

export type SiteHeader = NonNullable<Layout>["header"];

export type SiteFooter = NonNullable<Layout>["footer"];

export type SiteSeoDefaults = NonNullable<SiteSettings>["seo"];

export type SiteAnalytics = NonNullable<SiteSettings>["analytics"];

export type SiteSocialLink = NonNullable<
  NonNullable<SiteIdentity>["socialLinks"]
>[number];

export type FooterColumn = NonNullable<
  NonNullable<SiteFooter>["columns"]
>[number];

export type LayoutProps = {
  layout: Layout;
};

export type SiteSettingsProps = {
  settings: SiteSettings;
};

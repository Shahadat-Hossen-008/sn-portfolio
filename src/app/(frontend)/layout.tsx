import type { Metadata } from "next";

import GoogleTagManager from "@/components/analytics/GoogleTagManager";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { SanityLive, sanityFetch } from "@/sanity/lib/live";
import { buildMetadata } from "@/sanity/lib/metadata";
import { LAYOUT_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

/**
 * Layout for every public route.
 *
 * This is a *nested* layout: `<html>` / `<body>` come from `src/app/layout.tsx`.
 * Rendering them here as well used to emit two nested `<html>` elements.
 *
 * Both settings singletons are fetched together and passed down as plain
 * serializable props — the navbar and footer never fetch (see AGENTS.md §3.4).
 */
export async function generateMetadata(): Promise<Metadata> {
  const [{ data: layout }, { data: siteSettings }] = await Promise.all([
    sanityFetch({ query: LAYOUT_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  return buildMetadata({ layout, siteSettings, path: "/" });
}

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ data: layout }, { data: siteSettings }] = await Promise.all([
    sanityFetch({ query: LAYOUT_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  return (
    <>
      <Navbar layout={layout} />
      <main>{children}</main>
      <Footer layout={layout} />
      <GoogleTagManager id={siteSettings?.analytics?.googleTagManagerID} />
      <SanityLive />
    </>
  );
}

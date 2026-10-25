import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { LAYOUT_QUERY, SITE_SETTINGS_QUERY } from "@/layout/query";
import { sanityFetch } from "@/sanity/lib/live";
import {
  buildMetadata,
  getRedirectTarget,
  type PageSeo,
} from "@/sanity/lib/metadata";
import { SectionBuilder } from "@/sections/section-builder";
import type { IAboutPageProps } from "./interface";
import { ABOUT_PAGE_QUERY } from "./query";

export async function generateMetadata(): Promise<Metadata> {
  const [{ data: aboutPage }, { data: layout }, { data: siteSettings }] =
    await Promise.all([
      sanityFetch({ query: ABOUT_PAGE_QUERY }),
      sanityFetch({ query: LAYOUT_QUERY }),
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
    ]);

  const redirectTarget = getRedirectTarget(aboutPage?.seo);

  if (redirectTarget) redirect(redirectTarget);

  return buildMetadata({
    layout,
    siteSettings,
    pageSeo: (aboutPage?.seo ?? undefined) as PageSeo | undefined,
    path: "/about",
  });
}

export default async function AboutPage(props: IAboutPageProps) {
  await props.searchParams;
  const { data: aboutPage } = await sanityFetch({
    query: ABOUT_PAGE_QUERY,
  });

  if (!aboutPage) {
    notFound();
  }

  return (
    <main className="pt-8 pb-28">
      <SectionBuilder
        sections={aboutPage.sections}
        numbered={false}
      />
    </main>
  );
}

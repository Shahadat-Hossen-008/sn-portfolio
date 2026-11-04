import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import type { PROFILE_QUERYResult } from "@/sanity/types";
import HomePage from "./page";

vi.mock("@/sanity/lib/live", () => ({
  sanityFetch: vi.fn(),
}));

import { sanityFetch } from "@/sanity/lib/live";

const sampleProfileData: PROFILE_QUERYResult = {
  _id: "myProfilePage",
  _type: "myProfilePage",
  fullName: "Shahadat Hossen",
  roleTitle: "Frontend Engineer",
  location: "Remote",
  hero: {
    headline: "Building thoughtful web experiences",
    headlineAccent: null,
    subheadline: "Specializing in React, TypeScript, and Design Systems.",
    statusLabel: "Available",
    location: "Remote",
    statusIndicator: true,
    socialLinks: null,
    primaryCta: null,
    secondaryCta: null,
    scrollIndicatorText: null,
  },
  sections: [],
  seo: {
    title: "Portfolio",
    description: "Welcome to my portfolio",
    openGraph: null,
    robots: null,
    canonicalUrl: null,
    redirect: null,
    keywords: null,
  },
};

describe("HomePage", () => {
  it("fetches profile data cleanly via getProfile and renders MyProfilePageBuilder", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce({
      data: sampleProfileData,
    } as never);

    const PageComponent = await HomePage();
    const html = renderToStaticMarkup(PageComponent);

    expect(html).toContain("Building thoughtful web experiences");
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import type { ABOUT_PAGE_QUERYResult } from "@/sanity/types";
import AboutPage from "./page";

vi.mock("@/sanity/lib/live", () => ({
  sanityFetch: vi.fn(),
}));

import { sanityFetch } from "@/sanity/lib/live";

const sampleAboutData: ABOUT_PAGE_QUERYResult = {
  seo: {
    title: "About | Developer Portfolio",
    description: "About page description",
    openGraph: null,
    robots: null,
    canonicalUrl: null,
    redirect: null,
    keywords: null,
  },
  aboutIntro: {
    eyebrow: "About me",
    heading: "Design and code with purpose",
    headingAccent: "purpose",
    portrait: null,
    intro: "Intro lead text",
    body: "Intro body text",
  },
  sections: [
    {
      _id: "quote-1",
      _type: "quoteSection",
      quote: "Design is how it works",
      quoteAccent: null,
      note: "Steve Jobs",
    },
    {
      _id: "tf-1",
      _type: "technicalFoundation",
      eyebrow: "TECHNICAL FOUNDATION",
      statement: "Tools follow the problem",
      columns: [
        {
          _key: "c1",
          title: "FRONTEND",
          skills: ["Figma", "React"],
        },
      ],
    },
    {
      _id: "exp-1",
      _type: "experienceSection",
      eyebrow: "Experience",
      intro: "Intro",
      roles: [
        {
          _key: "r1",
          role: "Engineer",
          company: "Studio",
          startDate: "2024-01-01",
          endDate: null,
          current: true,
          outcome: "Outcome",
          tools: [{ _id: "t2", label: "React" }],
        },
      ],
    },
    {
      _id: "cta-1",
      _type: "ctaSection",
      eyebrow: "Next steps",
      heading: "Thoughtful teams, useful products",
      headingAccent: null,
      intro: "Let's connect",
      cta: {
        label: "Contact",
        type: "external",
        url: "https://example.com",
        openInNewTab: false,
        isDisabled: false,
        reference: null,
      },
    },
  ],
};

describe("AboutPage", () => {
  it("renders the page intro plus sections with exactly one h1 and no numbered headings", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce({
      data: sampleAboutData,
    } as never);

    const PageComponent = await AboutPage();
    const html = renderToStaticMarkup(PageComponent);

    const h1Matches = html.match(/<h1/g);
    expect(h1Matches).toHaveLength(1);
    expect(html).toContain("Design and code with <em");
    expect(html).toContain("Design is how it works");
    expect(html).toContain("Tools follow the problem");
    expect(html).toContain("Experience");
    expect(html).toContain("Engineer");
    expect(html).toContain("Thoughtful teams, useful products");

    // Numbered headings should NOT appear on the About page
    expect(html).not.toContain("02 —");
    expect(html).not.toContain("03 —");
  });
});
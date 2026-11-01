import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { PersonalIntroData } from "../interface";
import { PersonalIntroSectionBuilder, hasPersonalIntroContent } from "./index";

const mockData: PersonalIntroData = {
  _id: "personal-intro-1",
  _type: "personalIntroSection",
  heading: "Introduction",
  capabilities: {
    eyebrow: "Capabilities",
    items: [
      {
        _key: "cap-1",
        title: "Frontend Architecture",
        description: "Modern web apps with Next.js and React",
      },
    ],
  },
  personalIntro: {
    eyebrow: "About Me",
    title: "Hi, I am Shahadat",
    bio: "Passionate software engineer building web applications.",
    cta: null,
  },
  work: {
    eyebrow: "Selected Work",
    image: null,
    project: {
      _id: "proj-1",
      title: "Portfolio 2026",
      year: "2026",
      summary: "Modern developer portfolio",
      slug: "portfolio-2026",
      liveLink: "https://example.com",
      caseStudyLink: null,
      image: null,
    },
  },
  learning: {
    eyebrow: "Currently Learning",
    title: "Rust & WebAssembly",
    status: "Exploring",
  },
  beyondCode: {
    eyebrow: "Beyond Code",
    statement: "I enjoy photography and cycling.",
    interests: ["Photography", "Cycling"],
  },
  availability: {
    eyebrow: "Status",
    statusLabel: "Available",
    status: "Open for opportunities",
    cta: null,
  },
};

describe("hasPersonalIntroContent", () => {
  it("returns false when data is undefined", () => {
    expect(hasPersonalIntroContent(undefined)).toBe(false);
  });

  it("returns false when all tiles and capabilities are empty", () => {
    const emptyData: PersonalIntroData = {
      _id: "empty-1",
      _type: "personalIntroSection",
      heading: "Empty",
      capabilities: null,
      personalIntro: null,
      work: null,
      learning: null,
      beyondCode: null,
      availability: null,
    };
    expect(hasPersonalIntroContent(emptyData)).toBe(false);
  });

  it("returns true when capabilities are present", () => {
    const dataWithCap: PersonalIntroData = {
      _id: "cap-only",
      _type: "personalIntroSection",
      heading: "Cap only",
      capabilities: {
        eyebrow: "Test",
        items: [{ _key: "k1", title: "Testing", description: null }],
      },
      personalIntro: null,
      work: null,
      learning: null,
      beyondCode: null,
      availability: null,
    };
    expect(hasPersonalIntroContent(dataWithCap)).toBe(true);
  });

  it("returns true when at least one tile has content", () => {
    const dataWithIntro: PersonalIntroData = {
      _id: "intro-only",
      _type: "personalIntroSection",
      heading: "Intro only",
      capabilities: null,
      personalIntro: {
        eyebrow: null,
        title: "Hello",
        bio: null,
        cta: null,
      },
      work: null,
      learning: null,
      beyondCode: null,
      availability: null,
    };
    expect(hasPersonalIntroContent(dataWithIntro)).toBe(true);
  });
});

describe("PersonalIntroSectionBuilder", () => {
  it("renders null when section has no content", () => {
    const emptyData: PersonalIntroData = {
      _id: "empty-1",
      _type: "personalIntroSection",
      heading: "Empty",
      capabilities: null,
      personalIntro: null,
      work: null,
      learning: null,
      beyondCode: null,
      availability: null,
    };
    const html = renderToStaticMarkup(
      <PersonalIntroSectionBuilder data={emptyData} />,
    );
    expect(html).toBe("");
  });

  it("renders the bento section and tiles when content is present", () => {
    const html = renderToStaticMarkup(
      <PersonalIntroSectionBuilder data={mockData} />,
    );
    expect(html).toContain("aria-label=\"Personal introduction and overview\"");
    expect(html).toContain("Hi, I am Shahadat");
    expect(html).toContain("Portfolio 2026");
    expect(html).toContain("Rust &amp; WebAssembly");
    expect(html).toContain("Frontend Architecture");
  });
});

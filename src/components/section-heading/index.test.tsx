import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SectionHeading } from "./index";

describe("SectionHeading", () => {
  it("renders h1 by default and splits accent into an italic block", () => {
    const html = renderToStaticMarkup(
      <SectionHeading
        heading="I build with care, not noise."
        headingAccent="care, not noise."
      />,
    );

    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain("I build with ");
    expect(html).toMatch(/<em[^>]*italic[^>]*>care, not noise\.<\/em>/);
  });

  it("renders custom element like h2 when specified", () => {
    const html = renderToStaticMarkup(
      <SectionHeading
        as="h2"
        id="section-heading"
        eyebrow="The Person Behind The Code"
        heading="Design and code with purpose"
        headingAccent="purpose"
      />,
    );

    expect(html.match(/<h2/g)).toHaveLength(1);
    expect(html).toContain('id="section-heading"');
    expect(html).toContain("The Person Behind The Code");
    expect(html).toContain("Design and code with <em");
  });

  it("renders plain heading without em when headingAccent is missing or null", () => {
    const html = renderToStaticMarkup(
      <SectionHeading heading="Plain Heading Without Accent" />,
    );

    expect(html).toContain("Plain Heading Without Accent</h1>");
    expect(html).not.toContain("<em");
  });

  it("omits eyebrow when not provided", () => {
    const html = renderToStaticMarkup(
      <SectionHeading heading="Just the title" />,
    );

    expect(html.match(/<p/g)).toBeNull();
  });
});

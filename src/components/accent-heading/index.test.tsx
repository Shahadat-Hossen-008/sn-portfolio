import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AccentHeading } from "./index";

describe("AccentHeading", () => {
  it("renders heading with accent inside em", () => {
    const html = renderToStaticMarkup(
      <AccentHeading
        as="h2"
        id="test-heading"
        text="Design and code crafted for purpose"
        accent="crafted"
      />,
    );

    expect(html).toContain('<h2 id="test-heading"');
    expect(html).toContain('<em class="highlight-swipe bento-swipe italic px-1.5">crafted</em>');
  });

  it("renders plain text when accent is missing or does not match", () => {
    const htmlNoAccent = renderToStaticMarkup(
      <AccentHeading as="h1" text="Plain Heading Text" />,
    );
    expect(htmlNoAccent).toBe("<h1>Plain Heading Text</h1>");

    const htmlMismatch = renderToStaticMarkup(
      <AccentHeading as="h1" text="Plain Heading Text" accent="Nonexistent" />,
    );
    expect(htmlMismatch).toBe("<h1>Plain Heading Text</h1>");
  });

  it("renders as a paragraph when as='p'", () => {
    const html = renderToStaticMarkup(
      <AccentHeading as="p" text="Quote text with emphasis" accent="emphasis" />,
    );
    expect(html).toContain("<p");
    expect(html).not.toContain("<h");
    expect(html).toContain('<em class="highlight-swipe bento-swipe italic px-1.5">emphasis</em>');
  });
});

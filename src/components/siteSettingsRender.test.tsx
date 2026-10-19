import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import type { Layout } from "@/app/types/siteSettingsTypes";

/**
 * These render the real components with a hand-built settings object, because
 * the `production` dataset has no `layout` document to render against.
 * They are the closest thing to a CMS smoke test that does not require writing
 * to the dataset.
 */
const IMAGE_REF = {
  _type: "image",
  asset: { _type: "reference", _ref: "image-abc123-1200x630-png" },
};

const layout = {
  identity: {
    siteTitle: "Shahadat Hossain",
    siteDescription: "Full-stack developer",
    logo: {
      imageFile: IMAGE_REF,
      altText: "Shahadat's personal logo",
    },
    favicon: null,
    socialLinks: [
      { network: "github", label: null, url: "github.com/shahadat" },
      { network: "linkedin", label: "Connect on LinkedIn", url: "https://linkedin.com/in/x" },
      { network: "email", label: null, url: "mailto:me@example.com" },
      { network: "other", label: null, url: "javascript:alert(1)" },
    ],
  },
  header: {
    links: [
      { _key: "h", label: "Home", type: "internal", reference: { _type: "myProfilePage", slug: null }, url: null, openInNewTab: null, isDisabled: null },
      { _key: "a", label: "About", type: "external", reference: null, url: "https://mysite.com/about", openInNewTab: null, isDisabled: null },
      { _key: "c", label: "Contact", type: "external", reference: null, url: "https://mysite.com/contact", openInNewTab: null, isDisabled: true },
      { _key: "b", label: "Blog post", type: "internal", reference: { _type: "blogPost", slug: "ratemate" }, url: null, openInNewTab: null, isDisabled: null },
      { _key: "n", label: "Nowhere", type: "internal", reference: { _type: "aboutPage", slug: "about" }, url: null, openInNewTab: null, isDisabled: null },
      { _key: "g", label: "GitHub", type: "external", reference: null, url: "https://github.com/x", openInNewTab: true, isDisabled: null },
    ],
    showSocialLinks: true,
  },
  footer: {
    mainContent: "I build things for the web.",
    email: "me@example.com",
    phone: "+1 555 123 4567",
    base: "© 2026 Shahadat",
    columns: [
      {
        _key: "l1",
        label: "GitHub",
        type: "external",
        reference: null,
        url: "github.com/me",
        openInNewTab: null,
        isDisabled: null,
      },
      {
        _key: "l2",
        label: "Dead",
        type: "internal",
        reference: { _type: "projectPage" },
        url: null,
        openInNewTab: null,
        isDisabled: null,
      },
      {
        _key: "l3",
        label: "Unsafe",
        type: "external",
        reference: null,
        url: "javascript:alert(1)",
        openInNewTab: null,
        isDisabled: null,
      },
      {
        _key: "l4",
        label: "Missing reference",
        type: "internal",
        reference: null,
        url: null,
        openInNewTab: null,
        isDisabled: null,
      },
    ],
  },
} as unknown as Layout;

describe("Navbar", () => {
  const html = renderToStaticMarkup(<Navbar layout={layout} />);

  it("renders the logo alt text from customImage.altText", () => {
    expect(html).toContain('alt="Shahadat&#x27;s personal logo"');
  });

  it("resolves internal and external links to the right href", () => {
    expect(html).toContain('href="/"');
    expect(html).toContain('href="https://mysite.com/about"');
    expect(html).toContain('href="/blog/ratemate"');
    expect(html).toContain('href="https://github.com/x"');
  });

  it("drops links whose internal reference has no route", () => {
    expect(html).not.toContain("Nowhere");
    expect(html).not.toContain('href="/about"');
  });

  it("renders a disabled entry as text, never as a link", () => {
    expect(html).toContain("Contact");
    expect(html).not.toContain('href="https://mysite.com/contact"');
  });

  it("does not render a CTA when one is not configured", () => {
    expect(html).not.toContain("CTA");
  });

  it("shows only resolvable social links and blocks non-link schemes", () => {
    expect(html).toContain("github.com/shahadat");
    expect(html).toContain("mailto:me@example.com");
    expect(html).not.toContain("javascript:alert");
  });

  it("renders nothing when the singleton is missing", () => {
    expect(renderToStaticMarkup(<Navbar layout={null} />)).toBe("");
  });
});

describe("Footer", () => {
  const html = renderToStaticMarkup(<Footer layout={layout} />);

  it("renders brand, contact and base content", () => {
    expect(html).toContain("I build things for the web.");
    expect(html).toContain('href="mailto:me@example.com"');
    expect(html).toContain('href="tel:+15551234567"');
    expect(html).toContain("© 2026 Shahadat");
  });

  it("resolves footer links and drops unresolved entries", () => {
    expect(html).toContain("Links");
    expect(html).toContain('href="https://github.com/me"');
    expect(html).not.toContain("Dead");
    expect(html).not.toContain("Unsafe");
    expect(html).not.toContain("Missing reference");
    expect(html).not.toContain('href="#"');
  });

  it("renders nothing when the singleton is missing", () => {
    expect(renderToStaticMarkup(<Footer layout={null} />)).toBe("");
  });
});

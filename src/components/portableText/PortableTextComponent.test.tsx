import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-player", () => ({
  default: ({ src }: { src: string }) => <video data-player-src={src} />,
}));

import { PortableText } from "next-sanity";

import { portableTextComponents } from "./PortableTextComponent";
import { YouTube } from "../youTube/YouTube";

function renderPortableText(value: unknown) {
  return renderToStaticMarkup(
    <PortableText value={value as never} components={portableTextComponents} />,
  );
}

describe("PortableTextComponent", () => {
  it("resolves linkUrl annotations using the projected internal reference", () => {
    const html = renderPortableText([
      {
        _type: "block",
        _key: "block",
        style: "normal",
        markDefs: [
          {
            _type: "linkUrl",
            _key: "internal-link",
            label: "Blog post",
            type: "internal",
            reference: { _type: "blogPost", slug: "hello-world" },
          },
        ],
        children: [
          {
            _type: "span",
            _key: "text",
            text: "Read post",
            marks: ["internal-link"],
          },
        ],
      },
    ]);

    expect(html).toContain('href="/blog/hello-world"');
    expect(html).not.toContain('target="_blank"');
  });

  it("renders valid external linkUrl annotations with their new-tab setting", () => {
    const html = renderPortableText([
      {
        _type: "block",
        _key: "block",
        style: "normal",
        markDefs: [
          {
            _type: "linkUrl",
            _key: "external-link",
            label: "External site",
            type: "external",
            url: "https://example.com/resource",
            openInNewTab: true,
          },
        ],
        children: [
          {
            _type: "span",
            _key: "text",
            text: "Visit site",
            marks: ["external-link"],
          },
        ],
      },
    ]);

    expect(html).toContain('href="https://example.com/resource"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("omits malformed and unresolved links instead of rendering dead hrefs", () => {
    const html = renderPortableText([
      {
        _type: "block",
        _key: "block",
        markDefs: [
          {
            _type: "linkUrl",
            _key: "unsafe-link",
            label: "Unsafe",
            type: "external",
            url: "javascript:alert(1)",
          },
          {
            _type: "linkUrl",
            _key: "missing-reference",
            label: "Missing",
            type: "internal",
          },
        ],
        children: [
          { _type: "span", _key: "unsafe", text: "Unsafe", marks: ["unsafe-link"] },
          { _type: "span", _key: "missing", text: "Missing", marks: ["missing-reference"] },
        ],
      },
    ]);

    expect(html).toContain("Unsafe");
    expect(html).toContain("Missing");
    expect(html).not.toContain("<a ");
    expect(html).not.toContain('href="#"');
  });

  it("renders image blocks using imageFile and altText", () => {
    const html = renderPortableText([
      {
        _type: "customImage",
        _key: "image",
        imageFile: {
          _type: "image",
          asset: { _type: "reference", _ref: "image-test-100x100-png" },
        },
        altText: "A test image",
      },
    ]);

    expect(html).toContain('alt="A test image"');
    expect(html).toContain("cdn.sanity.io");
  });

  it("renders confirmed legacy portableImage blocks with the same image shape", () => {
    const html = renderPortableText([
      {
        _type: "portableImage",
        _key: "legacy-image",
        imageFile: {
          _type: "image",
          asset: { _type: "reference", _ref: "image-test-100x100-png" },
        },
        altText: "Legacy image",
      },
    ]);

    expect(html).toContain('alt="Legacy image"');
    expect(html).toContain("cdn.sanity.io");
  });

  it("renders code blocks and blockquotes", () => {
    const html = renderPortableText([
      {
        _type: "code",
        _key: "code",
        language: "typescript",
        filename: "example.ts",
        code: "const answer = 42;",
      },
      {
        _type: "block",
        _key: "quote",
        style: "blockquote",
        markDefs: [],
        children: [{ _type: "span", _key: "quote-text", text: "Quoted text", marks: [] }],
      },
    ]);

    expect(html).toContain("example.ts");
    expect(html).toContain("const answer = 42;");
    expect(html).toContain("<blockquote");
    expect(html).toContain("Quoted text");
  });

  it("uses ReactPlayer's v3 src API for embedded and direct media URLs", () => {
    const sources = [
      "https://www.youtube.com/watch?v=abcdefghijk",
      "https://cdn.example.com/video.mp4",
    ];

    for (const src of sources) {
      const html = renderToStaticMarkup(<YouTube url={src} />);
      expect(html).toContain(`data-player-src="${src}"`);
    }
  });

  it("safely skips malformed video and image blocks", () => {
    expect(
      renderPortableText([
        { _type: "youtube", _key: "video", url: "javascript:alert(1)" },
        { _type: "customImage", _key: "image", imageFile: null, altText: "Alt" },
        { _type: "code", _key: "invalid-code", code: null },
      ]),
    ).toBe("");
  });
});

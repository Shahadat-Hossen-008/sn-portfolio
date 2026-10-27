import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Image from "next/image";

import { isSupportedReactPlayerUrl } from "@/sanity/_root/portableText/iframe/videoUrl";
import { urlFor } from "@/sanity/lib/image";
import { resolveLink } from "@/lib/sanity/links";
import type { SanityLink } from "@/lib/sanity/links";
import { YouTube } from "@/components/youtube";
import type { IPortableTextComponents } from "./interface";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSanityLink(value: unknown): value is SanityLink {
  if (!isRecord(value)) return false;

  if (
    value.type !== "internal" &&
    value.type !== "external"
  ) {
    return false;
  }

  if (
    value.openInNewTab != null &&
    typeof value.openInNewTab !== "boolean"
  ) {
    return false;
  }

  if (value.type === "external") {
    return value.url == null || typeof value.url === "string";
  }

  return (
    isRecord(value.reference) &&
    typeof value.reference._type === "string" &&
    (value.reference.slug == null || typeof value.reference.slug === "string")
  );
}

function isSanityImageSource(value: unknown): value is SanityImageSource {
  if (!isRecord(value) || !isRecord(value.asset)) return false;

  return (
    typeof value.asset._ref === "string" ||
    typeof value.asset._id === "string" ||
    typeof value.asset.url === "string"
  );
}

function portableTextImageUrl(value: unknown): string | null {
  if (!isRecord(value) || !isSanityImageSource(value.imageFile)) return null;

  try {
    return urlFor(value.imageFile)
      .width(600)
      .height(400)
      .quality(80)
      .auto("format")
      .url();
  } catch {
    return null;
  }
}

function renderPortableTextImage(value: unknown) {
  const src = portableTextImageUrl(value);
  if (!src) return null;

  const alt =
    isRecord(value) && typeof value.altText === "string" ? value.altText : "";

  return (
    <Image
      className="rounded-lg h-auto my-10 mx-auto"
      src={src}
      alt={alt}
      width={600}
      height={400}
    />
  );
}

export const portableTextComponents: IPortableTextComponents = {
  types: {
    youtube: ({ value }) =>
      isRecord(value) && isSupportedReactPlayerUrl(value.url) ? (
        <YouTube url={value.url} />
      ) : null,

    customImage: ({ value }) => renderPortableTextImage(value),
    portableImage: ({ value }) => renderPortableTextImage(value),

    code: ({ value }) => {
      if (!isRecord(value) || typeof value.code !== "string") return null;

      const filename =
        typeof value.filename === "string" ? value.filename : null;
      const language =
        typeof value.language === "string" ? value.language : undefined;

      return (
        <figure className="my-6 overflow-hidden rounded-lg bg-foreground/5">
          {filename && (
            <figcaption className="border-b border-foreground/10 px-4 py-2 text-sm text-foreground/60">
              {filename}
            </figcaption>
          )}
          <pre className="overflow-x-auto p-4">
            <code className={language ? `language-${language}` : undefined}>
              {value.code}
            </code>
          </pre>
        </figure>
      );
    },
  },

  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-5 mb-2">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-base leading-7 mb-4 text-muted-foreground">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary/40 pl-4 italic text-foreground/70">
        {children}
      </blockquote>
    ),
  },

  marks: {
    linkUrl: ({ value, children }) => {
      if (!isSanityLink(value)) return <span>{children}</span>;

      const href = resolveLink(value);
      if (!href) return <span>{children}</span>;

      const openInNewTab = value.openInNewTab === true;

      return (
        <a
          href={href}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          className="text-blue-400 underline"
        >
          {children}
        </a>
      );
    },
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 mb-4 text-muted-foreground">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 mb-4 text-muted-foreground">{children}</ol>
    ),
  },
};

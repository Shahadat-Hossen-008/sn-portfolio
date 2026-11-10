import { resolveLink } from "@/lib/sanity/links";
import type { SanityLink } from "@/lib/sanity/links";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { EditorialCodeBlock } from "./code-block";
import { EditorialBlockquote } from "./editorial-blockquote";
import type { IPortableTextComponents } from "../interface";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isSanityLink(value: unknown): value is SanityLink {
  if (!isRecord(value)) return false;

  if (value.type !== "internal" && value.type !== "external") {
    return false;
  }

  if (value.openInNewTab != null && typeof value.openInNewTab !== "boolean") {
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

export function renderEditorialCodeOrMermaid(value: unknown) {
  if (!isRecord(value) || typeof value.code !== "string") return null;

  const filename = typeof value.filename === "string" ? value.filename : null;
  const language =
    typeof value.language === "string" ? value.language : undefined;

  if (language === "mermaid") {
    return <MermaidDiagram code={value.code} caption={filename} />;
  }

  return (
    <EditorialCodeBlock
      code={value.code}
      language={language}
      filename={filename}
    />
  );
}

/**
 * Shared editorial block typography used across top-level and nested Portable Text:
 * - Headings: Fraunces (`font-display`) using full available parent width (`w-full`).
 * - Paragraphs: Full available parent width without independent `max-w-*` restrictions, `leading-[1.68]`, consistent `mb-4` spacing.
 * - Blockquotes: Shared `EditorialBlockquote` occupying full available parent width (`w-full min-w-0`).
 */
export const editorialBlockComponents: NonNullable<
  IPortableTextComponents["block"]
> = {
  h1: ({ children }) => (
    <h2 className="w-full font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-[1.15] text-balance text-foreground mt-10 mb-4">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="w-full font-display text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight leading-[1.2] text-balance text-foreground mt-8 mb-3">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="w-full font-display text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight leading-tight text-balance text-foreground mt-6 mb-2.5">
      {children}
    </h3>
  ),
  normal: ({ children }) => (
    <p className="font-sans text-base leading-[1.68] text-muted-foreground mb-4 last:mb-0 text-pretty">
      {children}
    </p>
  ),
  blockquote: ({ children, value }) => {
    const attribution =
      isRecord(value) && typeof value.attribution === "string"
        ? value.attribution
        : isRecord(value) && typeof value.cite === "string"
          ? value.cite
          : null;
    return (
      <EditorialBlockquote attribution={attribution}>
        {children}
      </EditorialBlockquote>
    );
  },
};

export const editorialMarkComponents: NonNullable<
  IPortableTextComponents["marks"]
> = {
  strong: ({ children }) => (
    <strong className="font-bold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  underline: ({ children }) => (
    <span className="underline underline-offset-4">{children}</span>
  ),
  highlight: ({ children }) => (
    <span className="rounded bg-mint/35 px-1.5 py-0.5 font-medium text-foreground box-decoration-clone">
      {children}
    </span>
  ),
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
        className="link-hover-underline font-medium text-foreground transition-opacity hover:opacity-85"
      >
        {children}
      </a>
    );
  },
};

/**
 * Shared editorial list components using full available renderer width (`w-full`).
 */
export const editorialListComponents: NonNullable<
  IPortableTextComponents["list"]
> = {
  bullet: ({ children }) => (
    <ul className="my-4 w-full list-disc space-y-2 pl-5 font-sans text-base leading-[1.68] text-muted-foreground marker:text-foreground">
      {children}
    </ul>
  ),
  number: ({ children }) => (
    <ol className="my-4 w-full list-decimal space-y-2 pl-5 font-sans text-base leading-[1.68] text-muted-foreground marker:text-foreground">
      {children}
    </ol>
  ),
};

/**
 * Shared inline Portable Text components used inside `EditorialSection`
 * and `PortableTable` cells. Reuses the exact same block, mark, and list
 * rules as the top-level editorial renderer.
 */
export const inlinePortableTextComponents: IPortableTextComponents = {
  types: {
    code: ({ value }) => renderEditorialCodeOrMermaid(value),
  },
  block: {
    ...editorialBlockComponents,
    h1: ({ children }) => (
      <h3 className="w-full font-display text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight leading-[1.2] text-balance text-foreground mt-6 mb-3">
        {children}
      </h3>
    ),
    h2: ({ children }) => (
      <h3 className="w-full font-display text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight leading-[1.2] text-balance text-foreground mt-6 mb-3">
        {children}
      </h3>
    ),
  },
  marks: editorialMarkComponents,
  list: editorialListComponents,
};

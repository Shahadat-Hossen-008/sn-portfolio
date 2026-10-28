import { resolveLink } from "@/lib/sanity/links";
import type { SanityLink } from "@/lib/sanity/links";
import type { IPortableTextComponents } from "../interface";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isSanityLink(value: unknown): value is SanityLink {
  if (!isRecord(value)) return false;

  if (value.type !== "internal" && value.type !== "external") {
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

/**
 * Shared inline Portable Text components used inside `EditorialSection`
 * and `PortableTable` cells.
 */
export const inlinePortableTextComponents: IPortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h3 className="font-display text-title font-normal text-foreground mt-6 mb-3">
        {children}
      </h3>
    ),
    h2: ({ children }) => (
      <h3 className="font-display text-title font-normal text-foreground mt-6 mb-3">
        {children}
      </h3>
    ),
    h3: ({ children }) => (
      <h4 className="font-display text-lead font-medium text-foreground mt-5 mb-2">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-base leading-[1.65] text-muted-foreground mb-4 last:mb-0">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-2 border-primary/40 pl-4 italic text-foreground/80">
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
          className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 list-disc space-y-2 pl-5 text-base leading-[1.65] text-muted-foreground marker:text-foreground">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 list-decimal space-y-2 pl-5 text-base leading-[1.65] text-muted-foreground marker:text-foreground">
        {children}
      </ol>
    ),
  },
};

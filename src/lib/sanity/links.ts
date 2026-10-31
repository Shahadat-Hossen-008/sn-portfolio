import { resolveRoute } from "./routes";

/** The supported link kinds shared by Studio schemas and frontend utilities. */
export const LINK_TYPES = ["internal", "external"] as const;

export type LinkType = (typeof LINK_TYPES)[number];

export const LINK_TYPE_LABELS: Record<LinkType, string> = {
  internal: "Internal page",
  external: "External URL",
};

/**
 * A Sanity link object as projected by the frontend queries.
 *
 * `reference` is intentionally narrow: GROQ never returns the referenced
 * document, only enough of it (`_type` + `slug`) for `resolveRoute` to decide
 * whether a real path exists.
 */
export type SanityLink = {
  _key?: string | null;
  label?: string | null;
  type?: LinkType | null;
  /** `null` is expected for internal links; external URLs are validated when resolved. */
  url?: string | null;
  openInNewTab?: boolean | null;
  isDisabled?: boolean | null;
  reference?: { _type?: string | null; slug?: string | null } | null;
};

export type ResolvedNavLink = SanityLink & {
  href: string;
  external: boolean;
};

/** Links that must leave the SPA: `http(s)`, `mailto:`, `tel:`. */
export function isExternalHref(href: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/i.test(href);
}

/**
 * Normalises a CMS-authored external URL.
 *
 * Sanity's `string` type (rather than `url`) is used for social links and for
 * `link.url` so `mailto:` / `tel:` survive validation. A
 * bare host like `github.com/me` is upgraded to `https://github.com/me`.
 *
 * Anything that cannot be parsed — including values that contain whitespace or
 * quote characters such as the legacy `"https://…"` project links — returns
 * `null` so the link is dropped instead of rendering a broken href.
 */
export function normalizeExternalUrl(
  raw: string | null | undefined,
): string | null {
  const trimmed = raw?.trim();

  if (!trimmed) return null;
  // Whitespace and quotes cannot appear in a URL and are the exact shape of the
  // malformed legacy values in the dataset — reject rather than try to repair.
  if (/[\s"'<>]/.test(trimmed)) return null;

  try {
    const isAbsolute = /^https?:\/\//i.test(trimmed);
    const isMailOrTel = /^(mailto:|tel:)/i.test(trimmed);
    const candidate = isAbsolute || isMailOrTel ? trimmed : `https://${trimmed}`;
    const parsed = new URL(candidate);

    if (parsed.protocol === "mailto:" || parsed.protocol === "tel:") {
      return parsed.pathname ? trimmed : null;
    }

    if (
      (parsed.protocol !== "http:" && parsed.protocol !== "https:") ||
      !parsed.hostname
    ) {
      return null;
    }

    return isAbsolute ? trimmed : parsed.toString();
  } catch {
    return null;
  }
}

/**
 * The one place a CMS link becomes an `href`.
 *
 * Returns `null` — never a guessed path — when:
 *   - an internal reference points at a document type with no route, or at a
 *     `blogPost` that has no slug yet,
 *   - an external URL does not parse.
 */
export function resolveLink(link: SanityLink | null | undefined): string | null {
  if (!link) return null;

  switch (link.type) {
    case "internal":
      return resolveRoute(link.reference?._type, link.reference?.slug);

    case "external":
      return normalizeExternalUrl(link.url);

    default:
      return null;
  }
}

/**
 * Resolves and filters a link list.
 *
 * Unresolvable entries are dropped rather than rendered as dead `href`s, so a
 * half-configured `siteSettings` degrades to a shorter (but correct) nav.
 */

import Link from "next/link";
import type { ReactNode } from "react";

import type { ResolvedNavLink } from "@/sanity/lib/links";

type NavLinkItemProps = {
  link: ResolvedNavLink;
  className?: string;
  children?: ReactNode;
  /** Called on activation — used to close the mobile menu after navigation. */
  onNavigate?: () => void;
};

/**
 * Renders one already-resolved `navLink`.
 *
 * Internal links and anchors go through `next/link` for client navigation;
 * external links use a plain anchor so the browser (not the router) decides how
 * to leave the app. `isDisabled` renders the label as text with no href at
 * all — it is never a link that goes nowhere.
 *
 * `rel="noopener noreferrer"` is set explicitly alongside `target="_blank"`
 * because `noopener` is implied there but not by every browser.
 */
export default function NavLinkItem({
  link,
  className,
  children,
  onNavigate,
}: NavLinkItemProps) {
  const content = children ?? link.label;

  if (!link.href || link.isDisabled) {
    return (
      <span className={className} aria-disabled="true">
        {content}
      </span>
    );
  }

  if (link.external) {
    return (
      <a
        href={link.href}
        target={link.openInNewTab ? "_blank" : undefined}
        rel={link.openInNewTab ? "noopener noreferrer" : undefined}
        className={className}
        onClick={onNavigate}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className} onClick={onNavigate}>
      {content}
    </Link>
  );
}
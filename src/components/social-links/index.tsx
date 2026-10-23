import type { ComponentType } from "react";
import {
  FaBehance,
  FaDribbble,
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLink,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import { normalizeExternalUrl } from "@/sanity/lib/links";
import type { ISocialLinksProps, SiteSocialLink } from "./interface";

const NETWORK_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  x: FaXTwitter,
  instagram: FaInstagram,
  facebook: FaFacebook,
  youtube: FaYoutube,
  dribbble: FaDribbble,
  behance: FaBehance,
  email: FaEnvelope,
  other: FaLink,
};

const NETWORK_LABELS: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  x: "X",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  dribbble: "Dribbble",
  behance: "Behance",
  email: "Email",
  other: "Website",
};

/**
 * The site-wide social links, shared by the header and the footer.
 *
 * `socialLinks` is one array in `layout.identity`; each consumer decides
 * whether and how to show it. Entries with an unusable URL are dropped rather
 * than rendered as dead anchors.
 */
export function SocialLinks({
  links,
  className,
  variant = "icon",
}: ISocialLinksProps) {
  const entries = (links ?? [])
    .map((link) => {
      const href = normalizeExternalUrl(link.url);
      return href ? { ...link, href } : null;
    })
    .filter((link): link is SiteSocialLink & { href: string } => link !== null);

  if (entries.length === 0) return null;

  return (
    <ul className={className}>
      {entries.map((link) => {
        const Icon = NETWORK_ICONS[link.network] ?? FaLink;
        const fallbackLabel = NETWORK_LABELS[link.network] ?? "Website";
        const label = link.label?.trim() || fallbackLabel;

        return (
          <li key={`${link.network}-${link.url}`}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="inline-flex items-center gap-2 text-foreground/70 transition-colors duration-300 hover:text-primary"
            >
              <Icon className="text-lg" />
              {variant === "label" ? (
                <span className="text-sm">{label}</span>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default SocialLinks;

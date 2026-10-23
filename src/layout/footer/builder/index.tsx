import { hasSanityImage } from "@/sanity/lib/images";
import { isExternalHref, resolveLink } from "@/sanity/lib/links";
import { Footer } from "../index";
import type { IFooterProps } from "../interface";
import type { ISanityFooterProps } from "./interface";

/**
 * Site-wide footer builder.
 *
 * Structure mirrors the Studio `layout.footer` object: brand content, a
 * configurable link list, and a base bar.
 *
 * Footer columns filter unresolved links and cannot render a dead href.
 *
 * Renders nothing at all when `layout` does not exist yet, rather than an
 * empty shell.
 */
export function FooterBuilder({ layout }: ISanityFooterProps) {
  const identity = layout?.identity;
  const footer = layout?.footer;

  if (!identity) {
    return null;
  }

  const links = (footer?.columns ?? []).flatMap((link) => {
    const href = resolveLink(link);
    return href ? [{ ...link, href, external: isExternalHref(href) }] : [];
  });

  const hasLogoImage = hasSanityImage(identity.logo);

  const hasBrand =
    hasLogoImage ||
    Boolean(footer?.mainContent) ||
    Boolean(footer?.email) ||
    Boolean(footer?.phone) ||
    Boolean(identity.socialLinks?.length);

  if (!hasBrand && links.length === 0 && !footer?.base) {
    return null;
  }

  const footerProps: IFooterProps = {
    siteTitle: identity.siteTitle,
    logo: identity.logo,
    hasLogoImage,
    hasBrand,
    mainContent: footer?.mainContent,
    email: footer?.email,
    phone: footer?.phone,
    base: footer?.base,
    socialLinks: identity.socialLinks,
    links,
  };

  return <Footer {...footerProps} />;
}

export default FooterBuilder;

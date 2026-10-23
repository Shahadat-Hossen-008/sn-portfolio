import { hasSanityImage } from "@/sanity/lib/images";
import { isExternalHref, resolveLink } from "@/sanity/lib/links";
import type { ResolvedNavLink } from "@/sanity/lib/links";
import { Header } from "../index";
import type { IHeaderProps } from "../interface";
import type { ISanityHeaderProps } from "./interface";

/**
 * Site-wide header builder.
 *
 * Every value comes from the `layout` singleton — there are no hardcoded
 * nav entries and the logo is a Sanity asset, not a file in `public/`.
 *
 * The same resolved link array feeds the desktop bar and the mobile menu, so
 * the two can never drift apart. Unresolvable links (an internal reference to a
 * document with no route or a blank URL) are filtered rather than rendered as
 * dead hrefs.
 *
 * Renders nothing when the singleton has not been created yet.
 */
export function HeaderBuilder({ layout }: ISanityHeaderProps) {
  const identity = layout?.identity;
  const header = layout?.header;

  const logo = identity?.logo;
  const hasLogoImage = hasSanityImage(logo);
  const navLinks = (header?.links ?? []).flatMap((link): ResolvedNavLink[] => {
    const href = resolveLink(link);
    return href ? [{ ...link, href, external: isExternalHref(href) }] : [];
  });
  const ctaHref = resolveLink(header?.cta);
  const cta: ResolvedNavLink | undefined = ctaHref
    ? { ...header?.cta, href: ctaHref, external: isExternalHref(ctaHref) }
    : undefined;

  if (!identity) return null;
  if (!hasLogoImage && navLinks.length === 0 && !cta) return null;

  const headerProps: IHeaderProps = {
    siteTitle: identity.siteTitle,
    logo,
    hasLogoImage,
    navLinks,
    cta,
    showSocialLinks: header?.showSocialLinks,
    socialLinks: identity.socialLinks,
  };

  return <Header {...headerProps} />;
}

export default HeaderBuilder;

"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import NavLinkItem from "@/components/navlink/NavLinkItem";
import SocialLinks from "@/components/social/SocialLinks";
import { urlFor } from "@/sanity/lib/image";
import {
  isExternalHref,
  resolveLink,
} from "@/sanity/lib/links";
import type { ResolvedNavLink } from "@/sanity/lib/links";
import { hasSanityImage } from "@/sanity/lib/images";
import type { Layout } from "@/app/types/siteSettingsTypes";
import HamburgerMenu from "../../../public/icons/HamburgerMenu";
import CrossIcon from "../../../public/icons/CrossIcon";

const LINK_CLASS =
  "text-white hover:text-gray-300 transition-colors duration-300";
const CTA_CLASS =
  "bg-white text-[#212121] rounded-full px-6.5 py-3 text-base transition-colors duration-300 hover:bg-gray-200";

/**
 * Site-wide header.
 *
 * Every value comes from the `layout` singleton — there are no hardcoded
 * nav entries and the logo is a Sanity asset, not a file in `public/`.
 *
 * The same resolved link array feeds the desktop bar and the mobile menu, so
 * the two can never drift apart. Unresolvable links (an internal reference to a
 * document with no route or a blank URL) are filtered out in
 * Unresolvable links are filtered rather than rendered as dead hrefs.
 *
 * Renders nothing when the singleton has not been created yet.
 */
export default function Navbar({ layout }: { layout: Layout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const identity = layout?.identity;
  const header = layout?.header;

  const logo = identity?.logo;
  const navLinks = (header?.links ?? []).flatMap((link): ResolvedNavLink[] => {
    const href = resolveLink(link);
    return href ? [{ ...link, href, external: isExternalHref(href) }] : [];
  });
  const ctaHref = resolveLink(header?.cta);
  const cta: ResolvedNavLink | undefined = ctaHref
    ? { ...header?.cta, href: ctaHref, external: isExternalHref(ctaHref) }
    : undefined;

  // Next keeps this component mounted across navigations, so the open mobile
  // menu is closed explicitly on navigation (`closeMenu`) rather than by an
  // effect keyed on the pathname, which would cause a cascading render.
  useEffect(() => {
    if (!isMenuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  if (!identity) return null;
  if (!hasSanityImage(logo) && navLinks.length === 0 && !cta) return null;

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-20 py-4 lg:py-8 fixed left-0 right-0 top-0 z-100">
      <div
        className="grid grid-cols-2 lg:grid-cols-3
          items-center border border-white/15 rounded-full p-2 bg-black/30"
      >
        <div className="grid-cols-1 flex items-center gap-2">
          {hasSanityImage(logo) ? (
            <Link href="/" aria-label={logo?.altText || identity.siteTitle}>
              <Image
                src={urlFor(logo!.imageFile!).width(96).height(96).url()}
                alt={logo?.altText || identity.siteTitle || "Logo"}
                width={48}
                height={48}
                className="object-contain rounded-full"
              />
            </Link>
          ) : (
            identity.siteTitle && (
              <Link href="/" className="text-white font-semibold px-2">
                {identity.siteTitle}
              </Link>
            )
          )}
        </div>

        <div className="hidden lg:flex justify-center">
          {navLinks.length > 0 && (
            <nav className="flex gap-6 items-center" aria-label="Main">
              {navLinks.map((link) => (
                <NavLinkItem
                  key={link._key ?? link.label}
                  link={link}
                  className={LINK_CLASS}
                />
              ))}
            </nav>
          )}
        </div>

        <div className="flex-1 flex justify-end items-center gap-6">
          {header?.showSocialLinks && (
            <SocialLinks
              links={identity.socialLinks}
              className="hidden lg:flex items-center gap-4"
            />
          )}

          {cta?.href && !cta.isDisabled && (
            <NavLinkItem
              link={cta}
              className={`${CTA_CLASS} hidden md:inline-block`}
            />
          )}

          <div
            className="cursor-pointer lg:hidden"
            role="button"
            tabIndex={0}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setIsMenuOpen((open) => !open);
              }
            }}
          >
            {!isMenuOpen ? <HamburgerMenu /> : <CrossIcon />}
          </div>

          {isMenuOpen && (
            <div className="absolute top-full right-4 mt-2 w-56 bg-black border border-white/15 rounded-lg shadow-lg py-2 z-50">
              <nav
                className="flex flex-col gap-2"
                aria-label="Mobile"
              >
                {navLinks.map((link) => (
                  <NavLinkItem
                    key={link._key ?? link.label}
                    link={{ ...link, openInNewTab: false }}
                    className={`${LINK_CLASS} py-2 px-4`}
                    onNavigate={closeMenu}
                  />
                ))}

                {cta?.href && !cta.isDisabled && (
                  <NavLinkItem
                    link={cta}
                    className={`${CTA_CLASS} my-2`}
                    onNavigate={closeMenu}
                  />
                )}

                {header?.showSocialLinks && (
                  <SocialLinks
                    links={identity.socialLinks}
                    className="flex items-center gap-5 px-4 pt-3 mt-1 border-t border-white/10"
                  />
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

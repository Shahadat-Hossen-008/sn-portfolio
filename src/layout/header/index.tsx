"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { NavLinkItem } from "@/components/nav-link";
import { SocialLinks } from "@/components/social-links";
import { urlFor } from "@/sanity/lib/image";
import HamburgerMenu from "../../../public/icons/HamburgerMenu";
import CrossIcon from "../../../public/icons/CrossIcon";
import type { IHeaderProps } from "./interface";

const LINK_CLASS =
  "text-foreground hover:text-muted-foreground transition-colors duration-300";
const CTA_CLASS =
  "bg-limestone text-forest rounded-full px-6.5 py-3 text-base transition-colors duration-300 hover:bg-soft-limestone";

export function Header({
  siteTitle,
  logo,
  hasLogoImage,
  navLinks,
  cta,
  showSocialLinks,
  socialLinks,
}: IHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  // Next keeps this component mounted across navigations, so the open mobile
  // menu is closed explicitly on navigation (`closeMenu`) rather than by an
  // effect keyed on the pathname, which would cause a cascading render.
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-20 py-4 lg:py-8 fixed left-0 right-0 top-0 z-100">
      <div
        className="grid grid-cols-2 lg:grid-cols-3
          items-center border border-foreground/15 rounded-full p-2 bg-background/80"
      >
        <div className="grid-cols-1 flex items-center gap-2">
          {hasLogoImage ? (
            <Link href="/" aria-label={logo?.altText || siteTitle || undefined}>
              <Image
                src={urlFor(logo!.imageFile!).width(96).height(96).url()}
                alt={logo?.altText || siteTitle || "Logo"}
                width={48}
                height={48}
                className="object-contain rounded-full"
              />
            </Link>
          ) : (
            siteTitle && (
              <Link href="/" className="text-foreground font-semibold px-2">
                {siteTitle}
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
          {showSocialLinks && (
            <SocialLinks
              links={socialLinks}
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
            <div className="absolute top-full right-4 mt-2 w-56 bg-background border border-foreground/15 rounded-lg shadow-lg py-2 z-50">
              <nav className="flex flex-col gap-2" aria-label="Mobile">
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

                {showSocialLinks && (
                  <SocialLinks
                    links={socialLinks}
                    className="flex items-center gap-5 px-4 pt-3 mt-1 border-t border-foreground/10"
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

export default Header;

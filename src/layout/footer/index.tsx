import Image from "next/image";
import Link from "next/link";

import { NavLinkItem } from "@/components/nav-link";
import { Section } from "@/components/section";
import { SocialLinks } from "@/components/social-links";
import { urlFor } from "@/sanity/lib/image";
import type { IFooterProps } from "./interface";

export function Footer({
  siteTitle,
  logo,
  hasLogoImage,
  hasBrand,
  mainContent,
  email,
  phone,
  base,
  socialLinks,
  links,
}: IFooterProps) {
  return (
    <Section as="footer" tone="forest" className="border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          {hasBrand && (
            <div className="flex flex-col items-start gap-6 max-w-sm">
              {hasLogoImage && (
                <Link
                  href="/"
                  aria-label={logo?.altText || siteTitle || "Home"}
                >
                  <Image
                    src={urlFor(logo!.imageFile!)
                      .width(192)
                      .height(192)
                      .url()}
                    alt={logo?.altText || siteTitle || "Logo"}
                    width={56}
                    height={56}
                    className="object-contain rounded-full"
                  />
                </Link>
              )}

              {mainContent && (
                <p className="text-foreground/70 leading-relaxed">
                  {mainContent}
                </p>
              )}

              {(email || phone) && (
                <address className="not-italic flex flex-col gap-1 text-foreground/70">
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="transition-colors duration-300 hover:text-primary"
                    >
                      {email}
                    </a>
                  )}
                  {phone && (
                    <a
                      href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                      className="transition-colors duration-300 hover:text-primary"
                    >
                      {phone}
                    </a>
                  )}
                </address>
              )}

              <SocialLinks
                links={socialLinks}
                className="flex items-center gap-5"
              />
            </div>
          )}

          {links.length > 0 && (
            <nav
              aria-label="Footer links"
              className="flex flex-col items-start gap-4"
            >
              <h3 className="text-sm uppercase tracking-[0.14em] text-foreground/50">
                Links
              </h3>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link._key ?? link.label}>
                    <NavLinkItem
                      link={link}
                      className="text-foreground/80 transition-colors duration-300 hover:text-primary"
                    />
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {base && (
          <div className="mt-12 border-t border-foreground/10 pt-6 text-sm text-foreground/50">
            {base}
          </div>
        )}
      </div>
    </Section>
  );
}

export default Footer;

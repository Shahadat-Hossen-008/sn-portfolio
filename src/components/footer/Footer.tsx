import Image from "next/image";
import Link from "next/link";

import NavLinkItem from "@/components/navlink/NavLinkItem";
import SocialLinks from "@/components/social/SocialLinks";
import { urlFor } from "@/sanity/lib/image";
import { isExternalHref, resolveLink } from "@/sanity/lib/links";
import type { SanityLink } from "@/sanity/lib/links";
import { hasSanityImage } from "@/sanity/lib/images";
import type { Layout } from "@/app/types/siteSettingsTypes";

/**
 * Site-wide footer.
 *
 * Structure mirrors the Studio `layout.footer` object: brand column (logo,
 * pitch, email, phone, socials) + configurable link columns + a base bar.
 *
 * Footer columns filter unresolved links and cannot render a dead href.
 *
 * Renders nothing at all when `layout` does not exist yet, rather than an
 * empty shell.
 */
export default function Footer({ layout }: { layout: Layout }) {
  const identity = layout?.identity;
  const footer = layout?.footer;

  if (!identity) return null;

  const columns = (footer?.columns ?? [])
    .map((column) => ({
      ...column,
      links: ((column.links ?? []) as SanityLink[]).flatMap((link) => {
        const href = resolveLink(link);
        return href
          ? [{ ...link, href, external: isExternalHref(href) }]
          : [];
      }),
    }))
    .filter((column) => column.links.length > 0);

  const hasBrand =
    hasSanityImage(identity.logo) ||
    Boolean(footer?.mainContent) ||
    Boolean(footer?.email) ||
    Boolean(footer?.phone) ||
    Boolean(identity.socialLinks?.length);

  if (!hasBrand && columns.length === 0 && !footer?.base) return null;

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          {hasBrand && (
            <div className="flex flex-col items-start gap-6 max-w-sm">
              {hasSanityImage(identity.logo) && (
                <Link
                  href="/"
                  aria-label={
                    identity.logo?.altText || identity.siteTitle || "Home"
                  }
                >
                  <Image
                    src={urlFor(identity.logo!.imageFile!)
                      .width(192)
                      .height(192)
                      .url()}
                    alt={identity.logo?.altText || identity.siteTitle || "Logo"}
                    width={56}
                    height={56}
                    className="object-contain rounded-full"
                  />
                </Link>
              )}

              {footer?.mainContent && (
                <p className="text-white/70 leading-relaxed">
                  {footer.mainContent}
                </p>
              )}

              {(footer?.email || footer?.phone) && (
                <address className="not-italic flex flex-col gap-1 text-white/70">
                  {footer.email && (
                    <a
                      href={`mailto:${footer.email}`}
                      className="transition-colors duration-300 hover:text-primary"
                    >
                      {footer.email}
                    </a>
                  )}
                  {footer.phone && (
                    <a
                      href={`tel:${footer.phone.replace(/[^\d+]/g, "")}`}
                      className="transition-colors duration-300 hover:text-primary"
                    >
                      {footer.phone}
                    </a>
                  )}
                </address>
              )}

              <SocialLinks
                links={identity.socialLinks}
                className="flex items-center gap-5"
              />
            </div>
          )}

          {columns.length > 0 && (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {columns.map((column) => (
                <nav
                  key={column._key}
                  aria-label={column.title ?? undefined}
                  className="flex flex-col items-start gap-4"
                >
                  <h3 className="text-sm uppercase tracking-[0.14em] text-white/50">
                    {column.title}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {column.links.map((link) => (
                      <li key={link._key ?? link.label}>
                        <NavLinkItem
                          link={link}
                          className="text-white/80 transition-colors duration-300 hover:text-primary"
                        />
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          )}
        </div>

        {footer?.base && (
          <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/50">
            {footer.base}
          </div>
        )}
      </div>
    </footer>
  );
}

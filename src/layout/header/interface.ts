import type { ResolvedNavLink } from "@/lib/sanity/links";
import type { SiteIdentity, SiteSocialLink } from "../interface";

export type HeaderLogo = NonNullable<SiteIdentity>["logo"];

export interface IHeaderProps {
  siteTitle?: string | null;
  logo?: HeaderLogo;
  hasLogoImage: boolean;
  navLinks: ResolvedNavLink[];
  cta?: ResolvedNavLink;
  showSocialLinks?: boolean | null;
  socialLinks?: SiteSocialLink[] | null;
}

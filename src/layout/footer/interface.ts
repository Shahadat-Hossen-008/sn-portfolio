import type { ResolvedNavLink } from "@/lib/sanity/links";
import type { SiteIdentity, SiteSocialLink } from "../interface";

export type FooterLogo = NonNullable<SiteIdentity>["logo"];

export interface IFooterProps {
  siteTitle?: string | null;
  logo?: FooterLogo;
  hasLogoImage: boolean;
  hasBrand: boolean;
  mainContent?: string | null;
  email?: string | null;
  phone?: string | null;
  base?: string | null;
  socialLinks?: SiteSocialLink[] | null;
  links: ResolvedNavLink[];
}

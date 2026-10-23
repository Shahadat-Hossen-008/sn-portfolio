import type { LAYOUT_QUERYResult } from "@/sanity/types";

type SiteIdentity = NonNullable<LAYOUT_QUERYResult>["identity"];

export type SiteSocialLink = NonNullable<
  NonNullable<SiteIdentity>["socialLinks"]
>[number];

export interface ISocialLinksProps {
  links: SiteSocialLink[] | null | undefined;
  className?: string;
  /** `icon` renders a compact icon row; `label` renders the text next to it. */
  variant?: "icon" | "label";
}

import type { ReactNode } from "react";
import type { ResolvedNavLink } from "@/lib/sanity/links";

export interface INavLinkItemProps {
  link: ResolvedNavLink;
  className?: string;
  children?: ReactNode;
  /** Called on activation — used to close the mobile menu after navigation. */
  onNavigate?: () => void;
}

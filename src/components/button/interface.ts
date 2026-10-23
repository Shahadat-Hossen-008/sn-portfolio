import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "link" | "mint";

export interface IButtonProps {
  href: string;
  variant: ButtonVariant;
  children: ReactNode;
  /**
   * Open the destination in a new tab. This is the `openInNewTab` value from
   * the CMS link, not "is this an off-site URL" — that is detected from `href`.
   */
  external?: boolean;
}

import Link from "next/link";

import { isExternalHref } from "@/lib/sanity/links";
import type { ButtonVariant, IButtonProps } from "./interface";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "inline-flex min-h-11 items-center justify-center rounded-full bg-forest text-limestone no-underline hover:bg-soft-forest transition-colors duration-200 px-6 text-button shadow-sm hover:shadow-md",
  link: "inline-flex min-h-11 items-center text-button text-foreground no-underline transition-colors duration-200",
  mint: "bento-cta-button group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-mint px-6.5 py-3.5 font-sans text-button font-semibold leading-[1.2] text-forest no-underline focus-visible:outline-2 focus-visible:outline-mint focus-visible:outline-offset-3",
};

/**
 * Renders a real link: `next/link` for in-app routes, a plain anchor for
 * off-site/mailto/tel destinations. Nothing is ever rendered as a clickable
 * `div`, and the caller is responsible for dropping unresolvable hrefs.
 */
export function Button({
  href,
  variant,
  children,
  external = false,
  className: extraClassName,
}: IButtonProps) {
  const className = extraClassName
    ? `${VARIANT_CLASSES[variant]} ${extraClassName}`
    : VARIANT_CLASSES[variant];
  const target = external ? "_blank" : undefined;
  const rel = external ? "noopener noreferrer" : undefined;

  if (isExternalHref(href)) {
    return (
      <a href={href} target={target} rel={rel} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} target={target} rel={rel} className={className}>
      {children}
    </Link>
  );
}

export default Button;

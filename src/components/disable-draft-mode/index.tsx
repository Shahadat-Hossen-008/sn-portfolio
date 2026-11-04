"use client";

import { useDraftModeEnvironment } from "next-sanity/hooks";
import type { IDisableDraftModeProps } from "./interface";

/**
 * Renders a floating, non-intrusive badge when Next.js draft mode is active
 * outside of the Sanity Presentation Tool.
 *
 * When loaded inside the Studio Presentation iframe (`environment !== 'live'`),
 * it remains completely hidden so it never obstructs the editor canvas.
 */
export function DisableDraftMode({ className }: IDisableDraftModeProps) {
  const environment = useDraftModeEnvironment();

  // Hide inside the Sanity Presentation Tool (iframe or pop-up window)
  if (
    environment === "presentation-iframe" ||
    environment === "presentation-window"
  ) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={
        className ??
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-100 inline-flex items-center gap-3 rounded-full bg-forest/95 text-limestone border border-forest-border/40 px-4 py-2 text-xs font-sans font-medium shadow-panel backdrop-blur-md transition-all duration-200"
      }
    >
      <span
        aria-hidden="true"
        className="size-2 rounded-full bg-mint animate-pulse"
      />
      <span>Preview Mode Active</span>
      <a
        href="/api/draft-mode/disable"
        className="rounded-full bg-mint/15 px-2.5 py-1 text-mint font-semibold tracking-wide uppercase text-[11px] hover:bg-mint hover:text-forest transition-colors duration-150 no-underline"
      >
        Exit
      </a>
    </div>
  );
}

export default DisableDraftMode;

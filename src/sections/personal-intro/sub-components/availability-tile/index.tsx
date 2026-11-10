import Link from "next/link";
import { resolveLink } from "@/lib/sanity/links";
import { Tile } from "../tile";
import type { IAvailabilityTileProps } from "./interface";

export function AvailabilityTile({
  availability,
  rise = 5,
}: IAvailabilityTileProps) {
  const eyebrow = availability?.eyebrow?.trim() || "AVAILABILITY";
  const statusLabel = availability?.statusLabel?.trim() || "STATUS";
  const status = availability?.status?.trim() || "Open to collaborations";

  const cta = availability?.cta;
  const ctaLabel = cta?.label?.trim() || "Get in touch";
  const href =
    cta && !cta.isDisabled ? resolveLink(cta) : "mailto:contact@shahadat.dev";
  const isExternal = cta?.openInNewTab === true || href?.startsWith("mailto:");

  return (
    <Tile
      tone="light"
      labelledBy="personal-intro-avail-title"
      className="md:col-span-2 bento:col-span-4 flex flex-col md:flex-row md:items-center md:justify-between bento:flex-col bento:items-start bento:justify-between gap-5"
      rise={rise}
    >
      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-muted-forest">
            {eyebrow}
          </p>
          <span className="inline-flex shrink-0 items-center gap-1.5 font-sans text-[11px] font-semibold tracking-widest uppercase text-status-active">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-status-active"
            />
            {statusLabel}
          </span>
        </div>

        <p
          id="personal-intro-avail-title"
          className="font-sans text-base sm:text-button font-semibold text-forest leading-snug"
        >
          {status}
        </p>
      </div>

      {href && (
        <div className="mt-auto md:mt-0 bento:mt-auto shrink-0 pt-1 md:pt-0 bento:pt-1">
          <Link
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="group inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full bg-forest px-4 py-2.5 font-sans text-xs font-bold tracking-widest uppercase text-limestone no-underline transition-colors duration-200 hover:bg-soft-forest focus-visible:outline-2 focus-visible:outline-forest focus-visible:outline-offset-2"
            aria-label={`${ctaLabel} — send email or connect`}
          >
            <svg
              className="size-4 shrink-0 stroke-limestone fill-none stroke-[1.75]"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <polyline points="3 7 12 13 21 7" />
            </svg>
            <span>{ctaLabel}</span>
          </Link>
        </div>
      )}
    </Tile>
  );
}

export default AvailabilityTile;

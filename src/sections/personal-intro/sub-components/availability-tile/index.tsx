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
  const href = cta && !cta.isDisabled ? resolveLink(cta) : "mailto:contact@shahadat.dev";
  const isExternal = cta?.openInNewTab === true || href?.startsWith("mailto:");

  return (
    <Tile
      tone="light"
      labelledBy="personal-intro-avail-title"
      className="bento:col-span-3 flex flex-col justify-between gap-4"
      rise={rise}
    >
      <div className="flex flex-col gap-3">
        <p className="font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-forest">
          {eyebrow}
        </p>

        <div className="flex flex-col gap-0.5">
          <span className="font-sans text-[10px] font-bold tracking-[0.14em] uppercase text-muted-forest/75">
            {statusLabel}
          </span>
          <p
            id="personal-intro-avail-title"
            className="font-sans text-xs sm:text-sm font-semibold text-forest leading-snug"
          >
            {status}
          </p>
        </div>
      </div>

      <div className="mt-auto pt-2">
        {href && (
          <Link
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="group flex size-10 items-center justify-center rounded-full bg-forest text-limestone transition-all duration-200 hover:bg-soft-forest hover:scale-105 focus-visible:outline-2 focus-visible:outline-forest focus-visible:outline-offset-2"
            aria-label="Send email or get in touch"
          >
            <svg
              className="size-4.5 stroke-limestone fill-none stroke-[1.75] transition-transform duration-200 group-hover:-translate-y-0.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <polyline points="3 7 12 13 21 7" />
            </svg>
          </Link>
        )}
      </div>
    </Tile>
  );
}

export default AvailabilityTile;

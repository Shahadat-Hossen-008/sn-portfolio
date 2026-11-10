import Link from "next/link";
import { resolveLink } from "@/lib/sanity/links";
import { Tile } from "../tile";
import type { IPersonalIntroTileProps } from "./interface";

export function PersonalIntroTile({
  personalIntro,
  rise = 1,
}: IPersonalIntroTileProps) {
  const eyebrow = personalIntro?.eyebrow?.trim();
  const title = personalIntro?.title?.trim();
  const bio = personalIntro?.bio?.trim();

  const cta = personalIntro?.cta;
  const label = cta?.label?.trim();
  const href = cta && !cta.isDisabled ? resolveLink(cta) : null;
  const isExternal = cta?.openInNewTab === true;

  return (
    <Tile
      tone="light"
      labelledBy="personal-intro-main-title"
      className="md:col-span-1 bento:col-span-6 flex flex-col justify-between gap-6"
      rise={rise}
    >
      <div className="flex flex-col gap-3.5">
        {eyebrow && (
          <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-muted-forest">
            {eyebrow}
          </p>
        )}

        <h3
          id="personal-intro-main-title"
          className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-forest leading-[1.08] tracking-tight"
        >
          {title}
        </h3>

        {bio && (
          <p className="font-sans text-[15px] sm:text-base leading-[1.65] text-muted-forest max-w-[54ch]">
            {bio}
          </p>
        )}
      </div>

      {label && href && (
        <Link
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="group inline-flex w-fit items-center gap-1.5 rounded-sm py-1 -my-1 font-sans text-xs font-bold tracking-[0.12em] uppercase text-forest no-underline transition-colors hover:text-soft-forest focus-visible:outline-2 focus-visible:outline-forest focus-visible:outline-offset-4"
        >
          <span className="relative pb-0.5">
            {label}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-forest transition-all duration-300 ease-out group-hover:w-full group-focus-visible:w-full"
            />
          </span>
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1"
          >
            {isExternal ? "↗" : "→"}
          </span>
        </Link>
      )}
    </Tile>
  );
}

export default PersonalIntroTile;

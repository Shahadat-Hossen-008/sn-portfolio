import { Tile } from "../tile";
import type { IBeyondCodeTileProps } from "./interface";

export function BeyondCodeTile({
  beyondCode,
  rise = 4,
}: IBeyondCodeTileProps) {
  const eyebrow = beyondCode?.eyebrow?.trim() || "BEYOND CODE";
  const statement =
    beyondCode?.statement?.trim() ||
    "Photography, typography, and a deep appreciation for minimalistic architecture.";

  const rawInterests = (beyondCode?.interests ?? []).filter(
    (item): item is string => typeof item === "string" && Boolean(item.trim()),
  );

  const defaultInterests = ["Photography", "Typography", "Architecture"];
  const interests = rawInterests.length ? rawInterests : defaultInterests;

  return (
    <Tile
      tone="light"
      labelledBy="personal-intro-beyond-title"
      className="bento:col-span-4 flex flex-col justify-between gap-4"
      rise={rise}
    >
      <div className="flex flex-col gap-3">
        <p className="font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-forest">
          {eyebrow}
        </p>
        <p
          id="personal-intro-beyond-title"
          className="font-sans text-xs sm:text-sm leading-relaxed text-muted-forest/90"
        >
          {statement}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-4 pt-2 font-sans text-xs font-semibold text-forest">
        {interests.map((interest) => (
          <span key={interest} className="inline-flex items-center gap-1.5">
            {interest.toLowerCase().includes("photo") ? (
              <svg
                className="size-4 shrink-0 stroke-forest fill-none stroke-[1.75]"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <circle cx="12" cy="13.5" r="3.5" />
                <path d="M8 7l1.5-3h5L16 7" />
              </svg>
            ) : interest.toLowerCase().includes("type") ? (
              <svg
                className="size-4 shrink-0 stroke-forest fill-none stroke-[1.75]"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M5 20L12 4l7 16M8 14h8" />
              </svg>
            ) : (
              <svg
                className="size-4 shrink-0 stroke-forest fill-none stroke-[1.75]"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M3 21h18M5 21V10m14 11V10M9 21V10m6 11V10M2 10l10-6 10 6z" />
              </svg>
            )}
            {interest}
          </span>
        ))}
      </div>
    </Tile>
  );
}

export default BeyondCodeTile;

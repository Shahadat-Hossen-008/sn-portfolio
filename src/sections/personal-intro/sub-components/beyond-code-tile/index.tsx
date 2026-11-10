import { Tile } from "../tile";
import type { IBeyondCodeTileProps } from "./interface";

function renderInterestIcon(interest: string) {
  const lower = interest.toLowerCase();

  if (lower.includes("photo") || lower.includes("camera")) {
    return (
      <svg
        className="size-3.5 shrink-0 stroke-forest fill-none stroke-[1.75]"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <circle cx="12" cy="13.5" r="3.5" />
        <path d="M8 7l1.5-3h5L16 7" />
      </svg>
    );
  }

  if (lower.includes("book") || lower.includes("read")) {
    return (
      <svg
        className="size-3.5 shrink-0 stroke-forest fill-none stroke-[1.75]"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M2 4h7a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H2z" />
        <path d="M22 4h-7a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H22z" />
      </svg>
    );
  }

  if (
    lower.includes("travel") ||
    lower.includes("trip") ||
    lower.includes("world") ||
    lower.includes("explore")
  ) {
    return (
      <svg
        className="size-3.5 shrink-0 stroke-forest fill-none stroke-[1.75]"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5 15.5 8.5" />
      </svg>
    );
  }

  if (lower.includes("cycl") || lower.includes("bike")) {
    return (
      <svg
        className="size-3.5 shrink-0 stroke-forest fill-none stroke-[1.75]"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="6.5" cy="17.5" r="3.5" />
        <circle cx="17.5" cy="17.5" r="3.5" />
        <path d="M15 6h-3l-2 6h7l-2-6zM6.5 17.5L10 12" />
      </svg>
    );
  }

  if (
    lower.includes("type") ||
    lower.includes("font") ||
    lower.includes("design")
  ) {
    return (
      <svg
        className="size-3.5 shrink-0 stroke-forest fill-none stroke-[1.75]"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M5 20L12 4l7 16M8 14h8" />
      </svg>
    );
  }

  return (
    <svg
      className="size-3.5 shrink-0 stroke-forest fill-none stroke-[1.75]"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M3 21h18M5 21V10m14 11V10M9 21V10m6 11V10M2 10l10-6 10 6z" />
    </svg>
  );
}

export function BeyondCodeTile({ beyondCode, rise = 4 }: IBeyondCodeTileProps) {
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
      className="md:col-span-1 bento:col-span-4 flex flex-col justify-between gap-5"
      rise={rise}
    >
      <div className="flex flex-col gap-3">
        <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-muted-forest">
          {eyebrow}
        </p>
        <p
          id="personal-intro-beyond-title"
          className="font-sans text-sm sm:text-[15px] font-medium leading-relaxed text-forest"
        >
          {statement}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1 font-sans text-xs font-medium text-forest">
        {interests.map((interest) => (
          <span
            key={interest}
            className="inline-flex items-center gap-1.5 rounded-full border border-limestone-border/40 bg-background/70 px-2.5 py-1"
          >
            {renderInterestIcon(interest)}
            <span>{interest}</span>
          </span>
        ))}
      </div>
    </Tile>
  );
}

export default BeyondCodeTile;

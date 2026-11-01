import { Tile } from "../tile";
import type { ICapabilityStripProps } from "./interface";

const COLUMNS_BY_COUNT: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export function CapabilityStrip({
  eyebrow,
  items,
  rise = 0,
  tone = "light",
}: ICapabilityStripProps) {
  if (items.length === 0) return null;

  const label = eyebrow?.trim() || "What I build";
  const columns =
    COLUMNS_BY_COUNT[Math.min(items.length, 4)] ?? "lg:grid-cols-4";

  return (
    <Tile
      tone={tone}
      labelledBy="capability-strip-title"
      className="bento:col-span-12 flex flex-col justify-between gap-6"
      rise={rise}
    >
      <div className="flex items-center justify-between pb-3">
        <p
          id="capability-strip-title"
          className="font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-forest"
        >
          {label}
        </p>
        <span
          aria-hidden="true"
          className="font-sans text-xs font-semibold text-muted-forest/75"
        >
          0{items.length} Areas
        </span>
      </div>

      <ol
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${columns} divide-y sm:divide-y-0 sm:divide-x divide-foreground/10`}
      >
        {items.map((item, index) => (
          <li
            key={item._key}
            className="flex flex-col gap-2.5 pt-4 first:pt-0 sm:pt-0 sm:px-5 lg:px-6 sm:first:pl-0 sm:last:pr-0"
          >
            <span
              aria-hidden="true"
              className="font-sans text-xs font-bold tracking-[0.14em] text-status-active"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-lg sm:text-xl font-bold leading-snug text-forest">
              {item.title}
            </h3>
            {item.description && (
              <p className="font-sans text-xs sm:text-sm leading-relaxed text-muted-forest/90">
                {item.description}
              </p>
            )}
          </li>
        ))}
      </ol>
    </Tile>
  );
}

export default CapabilityStrip;

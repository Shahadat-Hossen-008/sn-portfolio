import { Tile } from "../tile";
import type { ICapabilityStripProps } from "./interface";

const COLUMNS_BY_COUNT: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

export function CapabilityStrip({
  eyebrow,
  items,
  rise = 0,
  tone = "light",
}: ICapabilityStripProps) {
  if (items.length === 0) return null;

  const label = eyebrow?.trim() || "What I build";
  const count = Math.min(items.length, 4);
  const columns = COLUMNS_BY_COUNT[count] ?? "md:grid-cols-3";
  const dividerClasses =
    count === 4
      ? "divide-y md:divide-y-0 lg:divide-x divide-foreground/12"
      : "divide-y md:divide-y-0 md:divide-x divide-foreground/12";
  const itemSpacingClasses =
    count === 4
      ? "pt-4 first:pt-0 md:pt-0 lg:px-6 lg:first:pl-0 lg:last:pr-0"
      : "pt-4 first:pt-0 md:pt-0 md:px-5 lg:px-6 md:first:pl-0 md:last:pr-0";

  return (
    <Tile
      tone={tone}
      labelledBy="capability-strip-title"
      className="md:col-span-2 bento:col-span-12 flex flex-col justify-between gap-5"
      rise={rise}
    >
      <div className="flex items-center justify-between">
        <p
          id="capability-strip-title"
          className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-muted-forest"
        >
          {label}
        </p>
        <span
          aria-hidden="true"
          className="font-sans text-xs font-semibold tabular-nums text-muted-forest"
        >
          {String(items.length).padStart(2, "0")} Areas
        </span>
      </div>

      <ol className={`grid grid-cols-1 gap-5 md:gap-0 ${columns} ${dividerClasses}`}>
        {items.map((item, index) => (
          <li
            key={item._key}
            className={`flex flex-col gap-2 ${itemSpacingClasses}`}
          >
            <span
              aria-hidden="true"
              className="font-sans text-xs font-bold tracking-[0.12em] tabular-nums text-status-active"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-sans text-base sm:text-lg font-bold tracking-tight leading-snug text-forest">
              {item.title}
            </h3>
            {item.description && (
              <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-muted-forest">
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

import type { NonNullableCuriosity } from "@/app/types/curiosityProps";
import Chip from "@/components/curiosity/Chip";
import Tile from "@/components/curiosity/Tile";

type Stack = NonNullableCuriosity["stack"];

export default function StackTile({
  stack,
  rise,
  layout,
}: {
  stack: Stack;
  rise: number;
  layout: "designed" | "fallback";
}) {
  const groups = (stack?.groups ?? []).slice(0, 4).flatMap((group) => {
    const label = group?.label?.trim();
    const items = (group?.items ?? []).slice(0, 6).flatMap((item) => {
      const tech = item?.tech?.label?.trim();
      return tech ? [{ tech, isPrimary: item?.isPrimary === true }] : [];
    });
    return label && items.length
      ? [{ label, description: group?.description?.trim(), items }]
      : [];
  });
  const hasPrimary = groups.some((group) => group.items.some((item) => item.isPrimary));

  if (!groups.length) return null;
  const className = layout === "designed"
    ? "bento:col-start-1 bento:col-end-8 bento:row-start-1 bento:row-end-3"
    : "bento:col-span-12";

  return (
    <Tile tone="flat" labelledBy="curiosity-stack-title" className={className} rise={rise}>
      <div className="flex items-center justify-between gap-4">
        <p className="lab flex items-center gap-2.5 font-mono text-label uppercase text-muted-sage">Stack</p>
        {hasPrimary && (
          <p className="lab flex items-center gap-2.5 font-mono text-label uppercase text-muted-sage">
            <i aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-mint" />
            Daily driver
          </p>
        )}
      </div>
      <h3 id="curiosity-stack-title" className="font-display text-title font-normal">{stack?.title?.trim() || "Tools I reach for first"}</h3>
      <ul className="grid flex-1 grid-cols-1 auto-rows-fr gap-4 bento:grid-cols-2">
        {groups.map((group) => (
          <li key={group.label} className="flex flex-col justify-between gap-4 rounded-nested border border-limestone/16 bg-soft-forest p-5">
            <div className="flex flex-col gap-1.5">
              <p className="lab font-mono text-label uppercase text-muted-sage">{group.label}</p>
              {group.description && <p className="text-caption text-muted-sage">{group.description}</p>}
            </div>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item, index) => (
                <Chip key={`${item.tech}-${index}`} dailyDriver={item.isPrimary} nested>{item.tech}</Chip>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Tile>
  );
}

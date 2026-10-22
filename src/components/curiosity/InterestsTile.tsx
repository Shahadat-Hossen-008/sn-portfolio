import type { NonNullableCuriosity } from "@/app/types/curiosityProps";
import Chip from "@/components/curiosity/Chip";
import Tile from "@/components/curiosity/Tile";

type Interests = NonNullableCuriosity["interests"];

export default function InterestsTile({
  interests,
  rise,
  layout,
}: {
  interests: Interests;
  rise: number;
  layout: "designed" | "fallback";
}) {
  const items = (interests?.items ?? [])
    .flatMap((item) => item?.trim() ? [item.trim()] : [])
    .slice(0, 5);
  if (!items.length) return null;
  const className = layout === "designed"
    ? "bento:col-start-1 bento:col-end-6 bento:row-start-3"
    : "bento:col-span-6";

  return (
    <Tile tone="forest" labelledBy="curiosity-interests-title" className={className} rise={rise}>
      <p className="lab font-mono text-label uppercase text-muted-sage">Interests</p>
      <h3 id="curiosity-interests-title" className="font-display text-title font-normal">{interests?.title?.trim() || "Outside the editor"}</h3>
      <ul className="flex flex-wrap gap-2">
        {items.map((item, index) => <Chip key={`${item}-${index}`}>{item}</Chip>)}
      </ul>
    </Tile>
  );
}

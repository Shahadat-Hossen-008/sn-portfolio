import type { NonNullableCuriosity } from "@/app/types/curiosityProps";
import Tile from "@/components/curiosity/Tile";

type Passion = NonNullableCuriosity["passion"];

export default function PassionTile({
  passion,
  rise,
  layout,
}: {
  passion: Passion;
  rise: number;
  layout: "designed" | "fallback";
}) {
  const statement = passion?.statement?.trim();
  if (!statement) return null;
  const className = layout === "designed"
    ? "bento:col-start-8 bento:col-end-13 bento:row-start-2"
    : "bento:col-span-6";

  return (
    <Tile tone="light" labelledBy="curiosity-passion-title" className={className} rise={rise}>
      <p className="lab font-mono text-label uppercase text-muted-forest">Passion</p>
      <span aria-hidden="true" className="block h-8 overflow-hidden font-display text-[64px] leading-none text-forest">“</span>
      <h3 id="curiosity-passion-title" className="font-display text-title font-normal">{statement}</h3>
    </Tile>
  );
}

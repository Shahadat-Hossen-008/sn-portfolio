import type { CSSProperties } from "react";
import { getTypedTimings } from "@/sections/curiosity/helpers";
import { Tile } from "../tile";
import type { ILearningTileProps } from "./interface";

export function LearningTile({
  learning,
  rise,
  layout,
}: ILearningTileProps) {
  const topics = getTypedTimings(learning?.topics ?? []);
  const upNext = learning?.upNext?.trim();
  if (!topics.length) return null;
  const className = layout === "designed"
    ? "bento:col-start-8 bento:col-end-13 bento:row-start-1"
    : "bento:col-span-6";

  return (
    <Tile tone="glow" labelledBy="curiosity-learning-title" className={className} rise={rise}>
      <p className="lab flex items-center gap-2.5 font-mono text-label uppercase text-muted-sage">
        <span aria-hidden="true" className="bento-pulse size-2 rounded-full bg-mint" />
        Learning now
      </p>
      <h3 id="curiosity-learning-title" className="font-display text-title font-normal">{learning?.title?.trim() || "Currently studying"}</h3>
      <p className="sr-only">{topics.map(({ text }) => text).join(", ")}</p>
      <div aria-hidden="true" className="relative h-11">
        {topics.map((topic, index) => (
          <span
            key={`${topic.text}-${index}`}
            className="bento-type-item absolute left-0 top-0 h-10 overflow-hidden whitespace-nowrap border-r-2 border-mint font-mono text-2xl leading-10 text-mint"
            data-animated={topics.length > 1 ? "" : undefined}
            style={{ "--n": topic.n, "--delay": `${topic.delay}s` } as CSSProperties}
          >
            {topic.text}
          </span>
        ))}
      </div>
      {upNext && <p className="lab mt-auto font-mono text-label uppercase text-muted-sage">Next on the shelf · {upNext}</p>}
    </Tile>
  );
}

export default LearningTile;

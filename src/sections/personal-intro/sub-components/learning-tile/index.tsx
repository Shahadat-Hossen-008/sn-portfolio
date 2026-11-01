import { Tile } from "../tile";
import type { ILearningTileProps } from "./interface";

export function LearningTile({ learning, rise = 3 }: ILearningTileProps) {
  const eyebrow = learning?.eyebrow?.trim() || "Currently building";
  const title =
    learning?.title?.trim() ||
    "Refining an open-source design token CLI and exploring the edge of React 19 Server Components.";
  const status = learning?.status?.trim() || "In progress";

  return (
    <Tile
      tone="light"
      labelledBy="personal-intro-learning-title"
      className="bento:col-span-5 flex flex-col justify-between gap-4"
      rise={rise}
    >
      <div className="flex flex-col gap-3">
        <p className="font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-forest">
          {eyebrow}
        </p>
        <p
          id="personal-intro-learning-title"
          className="font-sans text-sm sm:text-base font-semibold leading-relaxed text-forest"
        >
          {title}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-2 font-sans text-[11px] font-bold tracking-[0.14em] uppercase text-status-active pt-2">
        <span className="relative flex size-2 items-center justify-center">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-status-active/40 duration-1000" />
          <span className="relative inline-flex size-1.5 rounded-full bg-status-active" />
        </span>
        <span>{status}</span>
      </div>
    </Tile>
  );
}

export default LearningTile;

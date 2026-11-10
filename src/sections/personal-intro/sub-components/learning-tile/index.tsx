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
      className="md:col-span-1 bento:col-span-4 flex flex-col justify-between gap-5"
      rise={rise}
    >
      <div className="flex flex-col gap-3">
        <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-muted-forest">
          {eyebrow}
        </p>
        <p
          id="personal-intro-learning-title"
          className="font-sans text-base sm:text-button font-semibold leading-snug text-forest"
        >
          {title}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-2 pt-1 font-sans text-xs font-bold tracking-widest uppercase text-status-active">
        <span
          aria-hidden="true"
          className="relative flex size-2 shrink-0 items-center justify-center"
        >
          <span className="absolute inline-flex size-full animate-ping motion-reduce:animate-none rounded-full bg-status-active/40 duration-1000" />
          <span className="relative inline-flex size-1.5 rounded-full bg-status-active" />
        </span>
        <span>{status}</span>
      </div>
    </Tile>
  );
}

export default LearningTile;

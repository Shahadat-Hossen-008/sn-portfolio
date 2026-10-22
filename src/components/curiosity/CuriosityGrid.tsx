import type { CuriosityGridProps } from "@/app/types/curiosityProps";
import InterestsTile from "@/components/curiosity/InterestsTile";
import LearningTile from "@/components/curiosity/LearningTile";
import PassionTile from "@/components/curiosity/PassionTile";
import StackTile from "@/components/curiosity/StackTile";
import WorkTile from "@/components/curiosity/WorkTile";
import {
  getCuriosityTiles,
  getTileLayout,
  projectRows,
} from "@/sanity/lib/curiosity";
import { splitHeadline } from "@/sanity/lib/hero";

export default function CuriosityGrid({
  data,
  latestProjects,
  sectionNumber,
}: CuriosityGridProps) {
  const heading = data?.heading?.trim();
  const tiles = getCuriosityTiles(data, latestProjects);
  if (!heading || !Object.values(tiles).some(Boolean)) return null;

  const layout = getTileLayout(tiles);
  const headingParts = splitHeadline(heading, data?.headingAccent);
  const eyebrow = data?.eyebrow?.trim() ?? "";
  const eyebrowText =
    sectionNumber === undefined
      ? eyebrow
      : `${String(sectionNumber).padStart(2, "0")} — ${eyebrow}`.trim();
  const projects = projectRows(data?.work?.projects, latestProjects);

  return (
    <section
      aria-labelledby="curiosity-heading"
      className="bg-limestone text-forest"
    >
      <div className="mx-auto flex w-full max-w-page flex-col gap-12 px-8 pt-8 pb-28">
        <div
          aria-hidden="true"
          className="h-px w-full bg-linear-to-r from-forest/35 to-transparent"
        />
        <header className="bento-rise bento-rise--0 flex max-w-190 flex-col gap-4">
          {eyebrowText && (
            <p className="font-mono text-label uppercase text-muted-forest">
              {eyebrowText}
            </p>
          )}
          <h2
            id="curiosity-heading"
            className="font-display text-heading font-normal"
          >
            {headingParts.length === 3 ? (
              <>
                {headingParts[0]}
                <em className="highlight-swipe italic px-1.5 bento-swipe">
                  {headingParts[1]}
                </em>
                {headingParts[2]}
              </>
            ) : (
              headingParts[0]
            )}
          </h2>
          {data?.intro?.trim() && (
            <p className="text-lead text-muted-forest">{data.intro.trim()}</p>
          )}
        </header>
        <div className="grid grid-cols-1 gap-6 bento:grid-cols-12 bento:auto-rows-[minmax(264px,auto)]">
          {tiles.stack && (
            <StackTile stack={data?.stack ?? null} rise={1} layout={layout} />
          )}
          {tiles.learning && (
            <LearningTile
              learning={data?.learning ?? null}
              rise={2}
              layout={layout}
            />
          )}
          {tiles.passion && (
            <PassionTile
              passion={data?.passion ?? null}
              rise={3}
              layout={layout}
            />
          )}
          {tiles.interests && (
            <InterestsTile
              interests={data?.interests ?? null}
              rise={4}
              layout={layout}
            />
          )}
          {tiles.work && (
            <WorkTile
              work={data?.work ?? null}
              projects={projects}
              rise={5}
              layout={layout}
            />
          )}
        </div>
      </div>
    </section>
  );
}

import { InterestsTile } from "./sub-components/interests-tile";
import { LearningTile } from "./sub-components/learning-tile";
import { PassionTile } from "./sub-components/passion-tile";
import { StackTile } from "./sub-components/stack-tile";
import { WorkTile } from "./sub-components/work-tile";
import type { ICuriositySectionProps } from "./interface";

export function CuriositySection({
  data,
  eyebrowText,
  headingParts,
  intro,
  tiles,
  layout,
  projects,
}: ICuriositySectionProps) {
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
          {intro && (
            <p className="text-lead text-muted-forest">{intro}</p>
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

export default CuriositySection;

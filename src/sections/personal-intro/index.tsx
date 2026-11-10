import { AvailabilityTile } from "./sub-components/availability-tile";
import { CapabilityStrip } from "./sub-components/capability-strip";
import { BeyondCodeTile } from "./sub-components/beyond-code-tile";
import { LearningTile } from "./sub-components/learning-tile";
import { PersonalIntroTile } from "./sub-components/personal-intro-tile";
import { WorkTile } from "./sub-components/work-tile";
import type { IPersonalIntroSectionProps } from "./interface";

export function PersonalIntroSection({
  data,
  tiles,
  capabilities,
  featuredProject,
}: IPersonalIntroSectionProps) {
  return (
    <section
      aria-label="Personal introduction and overview"
      className="bg-background text-foreground border-b border-foreground/10"
    >
      <div className="mx-auto w-full max-w-page px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 bento:grid-cols-12 lg:gap-6">
          {capabilities.length > 0 && (
            <CapabilityStrip
              eyebrow={data?.capabilities?.eyebrow}
              items={capabilities}
              rise={0}
            />
          )}

          {tiles.personalIntro && (
            <PersonalIntroTile
              personalIntro={data?.personalIntro ?? null}
              rise={1}
            />
          )}

          {tiles.work && (
            <WorkTile
              work={data?.work ?? null}
              featuredProject={featuredProject}
              rise={2}
            />
          )}

          {tiles.learning && (
            <LearningTile
              learning={data?.learning ?? null}
              rise={3}
            />
          )}

          {tiles.beyondCode && (
            <BeyondCodeTile
              beyondCode={data?.beyondCode ?? null}
              rise={4}
            />
          )}

          {tiles.availability && (
            <AvailabilityTile
              availability={data?.availability ?? null}
              rise={5}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default PersonalIntroSection;

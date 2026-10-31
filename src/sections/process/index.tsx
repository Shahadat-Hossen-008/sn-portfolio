import { AccentHeading } from "@/components/accent-heading";
import { TagList } from "@/components/tag-list";
import { formatStepLabel } from "@/sections/shared/section-formatting";
import type { IProcessProps } from "./interface";

export function ProcessSection({
  eyebrow,
  heading,
  headingAccent,
  intro,
  steps,
}: IProcessProps) {
  const hasSteps = steps.length > 0;

  return (
    <section
      aria-labelledby="process-heading"
      className="bg-background text-foreground"
    >
      <div className="mx-auto w-full max-w-page px-8">
        <div className="grid grid-cols-1 gap-16 pt-24 bento:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex flex-col gap-4 bento:sticky bento:self-start bento:top-36">
            {eyebrow && (
              <p className="font-mono text-label uppercase text-muted-foreground">
                {eyebrow}
              </p>
            )}
            <AccentHeading
              as="h2"
              id="process-heading"
              text={heading}
              accent={headingAccent}
              className="font-display text-heading font-normal text-balance"
            />
            {intro && (
              <p className="mt-2 max-w-95 text-base leading-[1.6] text-muted-foreground">
                {intro}
              </p>
            )}
          </div>
          {hasSteps ? (
            <ol className="border-b border-foreground/20">
              {steps.map((step, index) => (
                <li
                  key={step._key}
                  className="flex flex-col gap-3 border-t border-foreground/20 py-7"
                >
                  <p className="font-mono text-label uppercase text-muted-foreground">
                    {formatStepLabel(index, step.label)}
                  </p>
                  <h3 className="font-display text-title font-normal">
                    {step.heading}
                  </h3>
                  <TagList tags={step.tools} />
                </li>
              ))}
            </ol>
          ) : (
            <div />
          )}
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;

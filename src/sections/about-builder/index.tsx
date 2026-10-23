import { Button } from "@/components/button";
import type { IAboutBuilderProps } from "./interface";

export function AboutBuilderSection({
  label,
  headingParts,
  intro,
  notes,
  facts,
  cta,
}: IAboutBuilderProps) {
  const hasBottomRow = facts.length > 0 || cta !== null;

  return (
    <section
      aria-labelledby="about-builder-heading"
      className="bg-background text-foreground"
    >
      <div className="mx-auto w-full max-w-page px-8 pt-8 pb-28">
        <div className="flex flex-col gap-12">
          <div
            aria-hidden="true"
            className="h-px w-full bg-linear-to-r from-foreground/35 to-transparent"
          />
          {label && (
            <p className="font-mono text-label uppercase text-muted-foreground">
              {label}
            </p>
          )}
          <div className="grid grid-cols-1 gap-6 bento:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] bento:items-end bento:gap-16">
            <div className="flex flex-col gap-6">
              <h2
                id="about-builder-heading"
                className="font-display text-heading font-normal text-balance"
              >
                {headingParts.length === 3 ? (
                  <>
                    {headingParts[0]}
                    <em className="highlight-swipe bento-swipe italic px-1.5">
                      {headingParts[1]}
                    </em>
                    {headingParts[2]}
                  </>
                ) : (
                  headingParts[0]
                )}
              </h2>
              {intro && (
                <p className="max-w-130 text-lead text-muted-foreground">
                  {intro}
                </p>
              )}
            </div>
            {notes.length > 0 && (
              <div className="grid grid-cols-1 gap-6 bento:grid-cols-2">
                {notes.map((note) => (
                  <div
                    key={note._key}
                    className="flex flex-col gap-3 border-t border-foreground/20 pt-5"
                  >
                    <h3 className="font-mono text-label font-normal uppercase text-muted-foreground">
                      {note.label}
                    </h3>
                    {note.text && (
                      <p className="text-base leading-[1.6] text-muted-foreground">
                        {note.text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {hasBottomRow && (
            <div className="flex flex-wrap items-center justify-between gap-6 border-t border-foreground/20 pt-6">
              {facts.length > 0 && (
                <dl className="flex flex-wrap gap-x-14 gap-y-6">
                  {facts.map((fact) => (
                    <div key={fact._key}>
                      <dt className="font-mono text-label uppercase text-muted-foreground">
                        {fact.label}
                      </dt>
                      <dd className="mt-1.5 text-base font-medium text-foreground">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              {cta && (
                <Button
                  href={cta.href}
                  variant="primary"
                  external={cta.openInNewTab}
                  className="min-h-12! gap-2.5 font-semibold hover:brightness-115 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground"
                >
                  {cta.label}
                  <span aria-hidden="true">→</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AboutBuilderSection;

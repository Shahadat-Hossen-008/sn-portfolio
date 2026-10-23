import { Fragment } from "react";
import type { CSSProperties } from "react";

import { Button } from "@/components/button";
import { SanityImage } from "@/components/image";
import { Section } from "@/components/section";
import type { IHeroProps } from "./interface";

export function PrimaryHero({
  statusLabel,
  location,
  subline,
  parts,
  primaryCta,
  secondaryCta,
  hasActions,
  showEyebrow,
  showPanel,
  nowBuildingTitle,
  progress,
  facts,
  portraitImage,
  portraitAlt,
  initials,
}: IHeroProps) {
  return (
    <Section
      aria-labelledby="hero-heading"
      className="flex min-h-[85svh] items-center overflow-hidden bg-page-gradient"
    >
      <div className="mx-auto w-full max-w-page px-8 pt-32 pb-20 lg:pt-36 lg:pb-28">
        <div className="grid gap-16 lg:grid-cols-[7fr_5fr] lg:items-center">
          <div className="flex flex-col gap-7">
            {showEyebrow && (
              <p className="hero-rise hero-rise-eyebrow flex items-center gap-3 font-mono text-label uppercase text-muted-foreground">
                <span
                  aria-hidden="true"
                  className="status-dot size-2 shrink-0 rounded-full bg-primary"
                />
                <span>
                  {statusLabel}
                  {statusLabel && location && (
                    <span aria-hidden="true" className="px-2">
                      ·
                    </span>
                  )}
                  [{location}]
                </span>
              </p>
            )}

            <h1
              id="hero-heading"
              className="hero-rise hero-rise-headline font-display text-display font-normal text-foreground"
            >
              {parts.length === 3 ? (
                <>
                  {parts[0]}
                  <em className="highlight-swipe italic px-1.5 hero-swipe">
                    {parts[1]}
                  </em>
                  {parts[2]}
                </>
              ) : (
                parts[0]
              )}
            </h1>

            {subline && (
              <p className="hero-rise hero-rise-subline max-w-130 text-lead text-muted-foreground">
                {subline}
              </p>
            )}

            {hasActions && (
              <div className="hero-rise hero-rise-actions flex flex-wrap items-center gap-5">
                {primaryCta && (
                  <Button
                    href={primaryCta.href}
                    variant="primary"
                    external={primaryCta.external}
                  >
                    {primaryCta.label}
                  </Button>
                )}
                {secondaryCta && (
                  <Button
                    href={secondaryCta.href}
                    variant="link"
                    external={secondaryCta.external}
                  >
                    {secondaryCta.label}
                  </Button>
                )}
              </div>
            )}

            <div
              aria-hidden="true"
              className="hero-rise hero-rise-scroll flex items-center gap-3 font-mono text-label uppercase text-muted-foreground"
            >
              <span>01 — Scroll</span>
              <span className="relative h-11 w-px overflow-hidden bg-fade-line">
                <span className="hero-drip absolute inset-x-0 top-0 h-3 bg-foreground" />
              </span>
            </div>
          </div>

          {showPanel && (
            <aside
              aria-label="Current focus"
              data-surface="forest"
              className="hero-panel flex flex-col gap-6 rounded-panel bg-panel-gradient p-8 text-foreground shadow-panel ring-1 ring-foreground/15"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="flex items-center gap-3 font-mono text-label uppercase text-muted-foreground">
                  <span
                    aria-hidden="true"
                    className="status-dot size-2 shrink-0 rounded-full bg-primary"
                  />
                  Now building
                </p>

                {portraitImage ? (
                  <SanityImage
                    image={portraitImage}
                    alt={portraitAlt}
                    width={52}
                    height={52}
                    className="size-13 rounded-full object-cover"
                  />
                ) : initials ? (
                  <span
                    aria-hidden="true"
                    className="flex size-13 shrink-0 items-center justify-center rounded-full bg-progress-gradient font-display text-primary-foreground"
                  >
                    {initials}
                  </span>
                ) : null}
              </div>

              {nowBuildingTitle && (
                <p className="hero-rise hero-rise-panel-title font-display text-title text-foreground">
                  {nowBuildingTitle}
                </p>
              )}

              {progress !== null && (
                <div className="flex flex-col gap-3">
                  <p className="flex items-center justify-between font-mono text-label uppercase text-muted-foreground">
                    <span>Build progress</span>
                    <span
                      className="hero-count"
                      style={{ "--n": String(progress) } as CSSProperties}
                    />
                  </p>
                  <div
                    aria-hidden="true"
                    className="h-1.5 overflow-hidden rounded-full bg-foreground/15"
                  >
                    <div
                      className="hero-fill h-full rounded-full bg-progress-gradient"
                      style={
                        {
                          "--progress": `${progress}%`,
                        } as CSSProperties
                      }
                    />
                  </div>
                </div>
              )}

              {facts.length > 0 && (
                <dl className="hero-rise hero-rise-facts grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-t border-border/40 pt-5">
                  {facts.map((fact, index) => (
                    <Fragment key={`${fact.label}-${index}`}>
                      <dt className="font-mono text-label text-muted-foreground">
                        {fact.label}
                      </dt>
                      <dd className="text-foreground">{fact.value}</dd>
                    </Fragment>
                  ))}
                </dl>
              )}
            </aside>
          )}
        </div>
      </div>
    </Section>
  );
}

export default PrimaryHero;

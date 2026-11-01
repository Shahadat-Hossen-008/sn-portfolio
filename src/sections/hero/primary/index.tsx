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
  nowBuildingDescription,
  progress,
  facts,
  portraitImage,
  portraitAlt,
  initials,
}: IHeroProps) {
  return (
    <Section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[85svh] flex-col justify-between overflow-hidden bg-background border-b border-foreground/10"
    >
      <div className="mx-auto w-full max-w-page px-6 pt-28 pb-12 sm:px-8 lg:px-12 lg:pt-36 lg:pb-16">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-6 sm:gap-7">
            {showEyebrow && (
              <p className="hero-rise hero-rise-eyebrow flex items-center gap-2.5 font-sans text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground">
                <span
                  aria-hidden="true"
                  className="relative flex size-2.5 shrink-0 items-center justify-center"
                >
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-status-active/30 duration-1000" />
                  <span className="relative inline-flex size-2 rounded-full bg-status-active" />
                </span>
                <span>
                  {statusLabel}
                  {statusLabel && location && (
                    <span aria-hidden="true" className="px-1.5 opacity-60">
                      ·
                    </span>
                  )}
                  {location && `[${location}]`}
                </span>
              </p>
            )}

            <h1
              id="hero-heading"
              className="hero-rise hero-rise-headline font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-bold text-foreground leading-[1.04] tracking-tight whitespace-pre-line max-w-xl"
            >
              {parts.length === 3 ? (
                <>
                  {parts[0]}
                  <em className="font-normal italic font-display">
                    {parts[1]}
                  </em>
                  {parts[2]}
                </>
              ) : (
                parts[0]
              )}
            </h1>

            {subline && (
              <p className="hero-rise hero-rise-subline max-w-xl font-sans text-base sm:text-lg lg:text-[1.1875rem] leading-relaxed text-muted-forest/85">
                {subline}
              </p>
            )}

            {hasActions && (
              <div className="hero-rise hero-rise-actions flex flex-wrap items-center gap-4 sm:gap-6 pt-1">
                {primaryCta && (
                  <Button
                    href={primaryCta.href}
                    variant="primary"
                    external={primaryCta.external}
                    className="gap-2 font-sans font-semibold text-sm no-underline bg-forest hover:bg-soft-forest text-limestone transition-colors duration-200"
                  >
                    <span>{primaryCta.label}</span>
                    <span
                      aria-hidden="true"
                      className="text-base font-normal leading-none"
                    >
                      ›
                    </span>
                  </Button>
                )}
                {secondaryCta && (
                  <Button
                    href={secondaryCta.href}
                    variant="link"
                    external={secondaryCta.external}
                    className="group relative inline-flex items-center gap-1.5 font-sans font-semibold text-sm text-foreground no-underline transition-colors duration-200 hover:text-muted-foreground"
                  >
                    <span className="relative pb-0.5">
                      {secondaryCta.label}
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-foreground transition-all duration-300 ease-out group-hover:w-full"
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1"
                    >
                      {secondaryCta.external ? "↗" : "→"}
                    </span>
                  </Button>
                )}
              </div>
            )}
          </div>

          {showPanel && (
            <div className="lg:rotate-[1.5deg] lg:hover:rotate-0 transition-transform duration-500 ease-out">
              <aside
                aria-label="Current focus"
                data-surface="forest"
                className="hero-panel relative flex flex-col gap-6 rounded-panel bg-forest p-7 sm:p-9 text-limestone shadow-2xl shadow-forest/25 border border-forest-border/30"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center rounded-full border border-mint/30 bg-mint/10 px-3 py-1 font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-mint">
                    Now building
                  </span>

                  {portraitImage ? (
                    <SanityImage
                      image={portraitImage}
                      alt={portraitAlt}
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover border border-white/15"
                    />
                  ) : initials ? (
                    <span
                      aria-hidden="true"
                      className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 font-sans text-xs font-semibold text-limestone/90"
                    >
                      {initials}
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-col gap-2">
                  {nowBuildingTitle && (
                    <h2 className="hero-rise hero-rise-panel-title font-sans text-xl sm:text-2xl font-bold tracking-tight text-limestone">
                      {nowBuildingTitle}
                    </h2>
                  )}

                  {nowBuildingDescription && (
                    <p className="font-sans text-xs sm:text-sm leading-relaxed text-muted-sage/85">
                      {nowBuildingDescription}
                    </p>
                  )}
                </div>

                {progress !== null && (
                  <div className="flex flex-col gap-2.5 pt-1">
                    <div className="flex items-center justify-between font-sans text-[11px] font-semibold tracking-[0.12em] uppercase text-muted-sage/75">
                      <span>Build progress</span>
                      <span className="font-sans text-[11px] font-semibold text-muted-sage/90 tabular-nums">
                        {progress}%
                      </span>
                    </div>
                    <div
                      aria-hidden="true"
                      className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
                    >
                      <div
                        className="hero-fill h-full rounded-full bg-mint"
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
                  <div className="hero-rise hero-rise-facts flex flex-col divide-y divide-white/10 border-t border-white/10 pt-3 mt-1">
                    {facts.map((fact, index) => (
                      <div
                        key={`${fact.label}-${index}`}
                        className="flex items-baseline justify-between gap-4 py-2.5 first:pt-1 last:pb-0"
                      >
                        <span className="shrink-0 font-sans text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-sage/70">
                          {fact.label}
                        </span>
                        <span className="font-sans text-xs sm:text-[13px] font-semibold tracking-wide uppercase text-limestone/95 text-right">
                          {fact.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </aside>
            </div>
          )}
        </div>

        <div
          aria-hidden="true"
          className="hero-rise hero-rise-scroll mt-12 lg:mt-16 flex flex-col items-center justify-center gap-3 text-center"
        >
          <span className="font-sans text-[10px] font-semibold tracking-[0.22em] uppercase text-muted-foreground">
            Scroll
          </span>
          <div className="relative h-12 w-px overflow-hidden bg-foreground/20">
            <div className="hero-scroll-runner absolute inset-x-0 top-0 h-full w-full bg-linear-to-b from-transparent via-foreground to-transparent" />
          </div>
        </div>
      </div>
    </Section>
  );
}

export default PrimaryHero;

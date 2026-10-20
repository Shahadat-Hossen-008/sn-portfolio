import { Fragment } from "react";
import type { CSSProperties } from "react";

import type { HeroProps } from "@/app/types/heroProps";
import Button from "@/components/button/Button";
import SanityImage from "@/components/image/Image";
import Section from "@/components/section/Section";
import { getInitials, splitHeadline } from "@/sanity/lib/hero";
import { resolveLink } from "@/sanity/lib/links";
import type { CustomImage } from "@/sanity/types";

type HeroCta = HeroProps["hero"]["primaryCta"];
type PortraitImageFile = NonNullable<
  NonNullable<HeroProps["hero"]["portrait"]>["imageFile"]
>;

/**
 * A CTA only survives when it is enabled, labelled, and resolvable. Unresolved
 * internal references and malformed URLs are dropped instead of rendered as
 * dead links.
 */
function resolveCta(cta: HeroCta) {
  if (!cta || cta.isDisabled) return null;

  const label = typeof cta.label === "string" ? cta.label.trim() : "";
  if (!label) return null;

  const href = resolveLink(cta);
  if (!href) return null;

  return { href, label, external: cta.openInNewTab === true };
}

/**
 * The query projects `imageFile.asset` as `{_id, url, metadata}` and does not
 * select `_ref`. The guarded `SanityImage` expects a Sanity image source, and
 * the asset `_id` is the reference id, so rebuild the source only after the
 * URL and both dimensions are present.
 */
function portraitSource(
  imageFile: PortraitImageFile,
): CustomImage["imageFile"] | null {
  const asset = imageFile.asset;
  const dimensions = asset?.metadata?.dimensions;

  if (!asset?.url || !asset._id || !dimensions?.width || !dimensions?.height) {
    return null;
  }

  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

export default function Hero({ hero, fullName }: HeroProps) {
  const statusLabel = hero.statusLabel?.trim() ?? "";
  const location = hero.location?.trim() ?? "";
  const subline = hero.subline?.trim() ?? "";

  const parts = splitHeadline(hero.headline, hero.headlineAccent);

  const primaryCta = resolveCta(hero.primaryCta);
  const secondaryCta = resolveCta(hero.secondaryCta);
  const hasActions = Boolean(primaryCta || secondaryCta);

  const nowBuildingTitle = hero.nowBuilding?.title?.trim() ?? "";
  const rawProgress = hero.nowBuilding?.progress;
  const progress =
    typeof rawProgress === "number" && Number.isFinite(rawProgress)
      ? Math.min(100, Math.max(0, Math.round(rawProgress)))
      : null;

  const facts = (hero.facts ?? []).flatMap((fact) => {
    const label = fact.label?.trim();
    const value = fact.value?.trim();
    return label && value ? [{ label, value }] : [];
  });

  const showPanel = Boolean(nowBuildingTitle || facts.length);
  const showEyebrow = Boolean(statusLabel || location);

  const portrait = hero.portrait;
  const portraitImage = portrait?.imageFile
    ? portraitSource(portrait.imageFile)
    : null;
  const initials = getInitials(fullName);

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
                  {location}
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
              <p className="hero-rise hero-rise-subline max-w-[32.5rem] text-lead text-muted-foreground">
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

                {portraitImage && portrait ? (
                  <SanityImage
                    image={portraitImage}
                    alt={portrait.altText}
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

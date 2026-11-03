import { getInitials, splitHeadline } from "@/lib/hero";
import { resolveLink } from "@/lib/sanity/links";
import type { CustomImage } from "@/sanity/types";
import { PrimaryHero } from "../index";
import type { IHeroCta, IHeroProps } from "../interface";
import type { ISanityPrimaryHeroProps } from "./interface";

type HeroCta = ISanityPrimaryHeroProps["hero"]["primaryCta"];
type PortraitImageFile = NonNullable<
  NonNullable<ISanityPrimaryHeroProps["hero"]["portrait"]>["imageFile"]
>;

/**
 * A CTA only survives when it is enabled, labelled, and resolvable. Unresolved
 * internal references and malformed URLs are dropped instead of rendered as
 * dead links.
 */
function resolveCta(cta: HeroCta): IHeroCta | null {
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
    ...(imageFile.crop ? { crop: imageFile.crop } : {}),
    ...(imageFile.hotspot ? { hotspot: imageFile.hotspot } : {}),
  } as CustomImage["imageFile"];
}

function resolveHeadlineParts(
  headline?: string | null,
  accent?: string | null,
): string[] {
  if (!headline) return [""];
  if (!accent || !accent.trim()) return [headline];

  // Try exact match first using shared splitHeadline
  const exactParts = splitHeadline(headline, accent);
  if (exactParts.length === 3) return exactParts;

  // Case-insensitive fallback for editor-provided accent
  const trimmed = accent.trim();
  const start = headline.toLowerCase().indexOf(trimmed.toLowerCase());
  if (start >= 0) {
    return [
      headline.slice(0, start),
      headline.slice(start, start + trimmed.length),
      headline.slice(start + trimmed.length),
    ];
  }

  return [headline];
}

export function PrimaryHeroBuilder({ hero, fullName }: ISanityPrimaryHeroProps) {
  const statusLabel = hero.statusLabel?.trim() ?? "";
  const location = hero.location?.trim() ?? "";
  const subline = hero.subline?.trim() ?? "";

  const parts = resolveHeadlineParts(hero.headline, hero.headlineAccent);

  const primaryCta = resolveCta(hero.primaryCta);
  const secondaryCta = resolveCta(hero.secondaryCta);
  const hasActions = Boolean(primaryCta || secondaryCta);

  const nowBuildingTitle = hero.nowBuilding?.title?.trim() ?? "";
  const nowBuildingDescription = hero.nowBuilding?.description?.trim() ?? "";
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

  const props: IHeroProps = {
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
    portraitImage: portrait ? portraitImage : null,
    portraitAlt: portrait?.altText,
    initials,
  };

  return <PrimaryHero {...props} />;
}

export default PrimaryHeroBuilder;

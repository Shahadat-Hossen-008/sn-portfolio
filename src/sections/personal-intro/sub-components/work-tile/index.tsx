import Link from "next/link";
import { SanityImage } from "@/components/image";
import { hasSanityImage } from "@/sanity/lib/images";
import type { CustomImage } from "@/sanity/types";
import { Tile } from "../tile";
import type { IWorkTileProps } from "./interface";

export function WorkTile({ work, featuredProject, rise = 2 }: IWorkTileProps) {
  if (!featuredProject) {
    return null;
  }

  const eyebrow = work?.eyebrow?.trim() || "Selected project";
  const { title, summary, year, href, openInNewTab } = featuredProject;

  const rawImage = featuredProject.image;
  const asset = rawImage?.imageFile?.asset as {
    _id?: string;
    _ref?: string;
  } | null;
  const assetId = asset?._id ?? asset?._ref;
  const imageSource: CustomImage["imageFile"] | null =
    hasSanityImage(rawImage) && assetId
      ? ({
          _type: "image",
          asset: { _type: "reference", _ref: assetId },
          ...(rawImage?.imageFile?.crop
            ? { crop: rawImage.imageFile.crop }
            : {}),
          ...(rawImage?.imageFile?.hotspot
            ? { hotspot: rawImage.imageFile.hotspot }
            : {}),
        } as CustomImage["imageFile"])
      : null;

  return (
    <Tile
      tone="flat"
      labelledBy="personal-intro-work-title"
      className="bento:col-span-6 justify-end gap-3 bg-forest text-limestone border border-forest-border/40 min-h-64"
      rise={rise}
    >
      {imageSource && (
        <>
          <SanityImage
            image={imageSource}
            alt=""
            width={900}
            height={600}
            className="absolute inset-0 z-0 size-full object-cover"
          />
          {/* Dark gradient keeps the text above WCAG AA contrast on any image. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-forest via-forest/80 to-forest/30"
          />
        </>
      )}

      <div className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-sage">
            {eyebrow}
          </p>
          {year && (
            <span className="font-sans text-xs font-semibold text-muted-sage">
              {year}
            </span>
          )}
        </div>

        <h3
          id="personal-intro-work-title"
          className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-limestone"
        >
          {title}
        </h3>

        {summary && (
          <p className="font-sans text-sm leading-relaxed text-limestone/85 line-clamp-3 max-w-lg">
            {summary}
          </p>
        )}

        <Link
          href={href}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          className="group mt-1 inline-flex w-fit items-center gap-1.5 rounded-full border border-mint/40 bg-mint/10 px-4 py-3 font-sans text-xs font-bold tracking-[0.12em] uppercase text-mint no-underline transition-all duration-200 hover:border-mint hover:bg-mint hover:text-forest"
        >
          <span>Case study</span>
          <span
            aria-hidden="true"
            className="text-sm font-normal leading-none transition-transform duration-200 group-hover:translate-x-0.5"
          >
            ›
          </span>
        </Link>
      </div>
    </Tile>
  );
}

export default WorkTile;

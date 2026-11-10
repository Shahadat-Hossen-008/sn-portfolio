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
      className="group/work md:col-span-1 bento:col-span-6 justify-between gap-6 bg-forest text-limestone"
      rise={rise}
    >
      {imageSource && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          <SanityImage
            image={imageSource}
            alt=""
            width={900}
            height={600}
            className="size-full scale-105 object-cover object-center opacity-40"
          />
          {/* Rich forest scrim keeps top metadata and bottom narrative well above WCAG AA contrast on any screenshot. */}
          <div className="absolute inset-0 bg-linear-to-t from-forest via-forest/92 to-forest/80" />
        </div>
      )}

      <div className="relative z-10 flex items-center justify-between gap-4">
        <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-muted-sage">
          {eyebrow}
        </p>
        {year && (
          <span className="font-sans text-xs font-semibold tabular-nums text-limestone/80">
            {year}
          </span>
        )}
      </div>

      <div className="relative z-10 flex flex-col gap-3">
        <h3
          id="personal-intro-work-title"
          className="font-display text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-limestone"
        >
          {title}
        </h3>

        {summary && (
          <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-limestone/90 line-clamp-3 max-w-[52ch]">
            {summary}
          </p>
        )}

        <Link
          href={href}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          className="group mt-1 inline-flex w-fit items-center gap-1.5 rounded-full border border-mint/45 bg-mint/12 px-4 py-2.5 font-sans text-xs font-bold tracking-widest uppercase text-mint no-underline transition-colors duration-200 hover:border-mint hover:bg-mint hover:text-forest focus-visible:outline-2 focus-visible:outline-mint focus-visible:outline-offset-3"
        >
          <span>Case study</span>
          <span
            aria-hidden="true"
            className="text-sm font-normal leading-none transition-transform duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5"
          >
            ›
          </span>
        </Link>
      </div>
    </Tile>
  );
}

export default WorkTile;

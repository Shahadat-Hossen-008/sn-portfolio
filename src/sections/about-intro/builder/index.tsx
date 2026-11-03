import type { CustomImage } from "@/sanity/types";
import { AboutIntroSection } from "../index";
import type { IAboutIntroPortrait, IAboutIntroProps } from "../interface";
import type { ISanityAboutIntroProps } from "./interface";

type PortraitAsset = {
  _id?: string;
  url?: string;
  metadata?: {
    dimensions?: {
      width?: number;
      height?: number;
    };
  };
};

type PortraitImageFile = {
  asset?: PortraitAsset | null;
  crop?: CustomImage["imageFile"] extends { crop?: infer C } ? C : unknown;
  hotspot?: CustomImage["imageFile"] extends { hotspot?: infer H } ? H : unknown;
};

function resolvePortrait(
  portrait?: {
    imageFile?: PortraitImageFile | null;
    altText?: string | null;
  } | null,
): IAboutIntroPortrait | null {
  const imageFile = portrait?.imageFile;
  const asset = imageFile?.asset;
  if (!asset?._id && !asset?.url) return null;

  const imageSource: CustomImage["imageFile"] = asset._id
    ? ({
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        ...(imageFile?.crop ? { crop: imageFile.crop } : {}),
        ...(imageFile?.hotspot ? { hotspot: imageFile.hotspot } : {}),
      } as CustomImage["imageFile"])
    : (imageFile as CustomImage["imageFile"]);

  return {
    imageFile: imageSource,
    altText: portrait?.altText || null,
  };
}

export function AboutIntroSectionBuilder({ data }: ISanityAboutIntroProps) {
  const heading = typeof data?.heading === "string" ? data.heading.trim() : "";
  if (!data || !heading) {
    return null;
  }

  const props: IAboutIntroProps = {
    eyebrow:
      typeof data.eyebrow === "string" ? data.eyebrow.trim() || undefined : undefined,
    heading,
    headingAccent: data.headingAccent,
    portrait: resolvePortrait(
      data.portrait as Parameters<typeof resolvePortrait>[0],
    ),
    intro:
      typeof data.intro === "string" ? data.intro.trim() || undefined : undefined,
    body:
      typeof data.body === "string" ? data.body.trim() || undefined : undefined,
  };

  return <AboutIntroSection {...props} />;
}

export default AboutIntroSectionBuilder;

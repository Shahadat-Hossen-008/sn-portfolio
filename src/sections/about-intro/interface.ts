import type { CustomImage } from "@/sanity/types";

export interface IAboutIntroPortrait {
  imageFile?: CustomImage["imageFile"] | null;
  altText?: string | null;
}

export interface IAboutIntroProps {
  eyebrow?: string;
  heading: string;
  headingAccent?: string | null;
  portrait?: IAboutIntroPortrait | null;
  intro?: string;
  body?: string;
}

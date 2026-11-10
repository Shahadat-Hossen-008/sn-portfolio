import type { PortableTextBlock } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface IProjectTag {
  _id: string;
  label?: string | null;
}

export interface IProjectImage {
  altText?: string | null;
  imageFile?: SanityImageSource | null;
}

export interface IProjectItem {
  _id: string;
  projectTitle: string;
  slug?: string | null;
  projectDescription?: string | PortableTextBlock[] | null;
  liveLink?: string | null;
  githubUrl?: string | null;
  projectImage?: IProjectImage | null;
  stack?: ReadonlyArray<IProjectTag | null> | null;
}

export type ProjectItem = IProjectItem;

export interface IProjectsSectionProps {
  eyebrow?: string | null;
  heading?: string | null;
  headingAccent?: string | null;
  projects: ReadonlyArray<IProjectItem>;
}

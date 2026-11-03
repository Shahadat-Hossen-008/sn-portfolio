export interface ISanityPhilosophyItem {
  _key?: string;
  title?: string | null;
  description?: string | null;
  tag?: string | null;
}

export interface ISanityPhilosophyProps {
  _id?: string;
  _type?: "philosophySection";
  eyebrow?: string | null;
  items?: ISanityPhilosophyItem[] | null;
}

export type NonNullablePhilosophy = ISanityPhilosophyProps & {
  _id: string;
  _type: "philosophySection";
};

export interface IPhilosophySectionBuilderProps {
  data: ISanityPhilosophyProps | null | undefined;
}

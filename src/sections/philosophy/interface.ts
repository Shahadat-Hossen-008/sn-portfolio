export interface IPhilosophyItem {
  _key?: string;
  title: string;
  description: string;
  tag?: string | null;
}

export interface IPhilosophyProps {
  eyebrow?: string | null;
  items?: IPhilosophyItem[];
}

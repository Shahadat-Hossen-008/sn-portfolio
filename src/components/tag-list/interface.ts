export interface ITagItem {
  _id: string;
  label: string;
}

export interface ITagListProps {
  tags?: ITagItem[] | null;
}

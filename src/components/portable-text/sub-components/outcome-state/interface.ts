export interface IOutcomeStateItem {
  _key?: string;
  value?: string | null;
  label?: string | null;
}

export interface IOutcomeStateProps {
  heading?: string | null;
  stats?: IOutcomeStateItem[] | null;
}

export interface IDecisionCardItem {
  _key?: string;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
}

export interface IDecisionCardsProps {
  cards?: IDecisionCardItem[] | null;
}

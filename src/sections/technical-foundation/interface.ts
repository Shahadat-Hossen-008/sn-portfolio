export interface ITechnicalSkill {
  _key?: string;
  label: string;
  context?: string | null;
}

export interface ITechnicalColumn {
  _key?: string;
  title: string;
  skills: ITechnicalSkill[];
}

export interface ITechnicalFoundationProps {
  eyebrow?: string;
  statement: string;
  columns: ITechnicalColumn[];
}

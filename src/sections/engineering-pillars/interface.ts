export type PillarColumn = {
  _key: string;
  label: string;
  statement: string;
  items?: string[];
};

export interface IEngineeringPillarsProps {
  columns: PillarColumn[];
}

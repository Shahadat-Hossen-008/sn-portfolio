import type {
  IPersonalIntroFeaturedProject,
  PersonalIntroData,
} from "../../interface";

export type Work = NonNullable<PersonalIntroData>["work"];

export interface IWorkTileProps {
  work: Work;
  featuredProject: IPersonalIntroFeaturedProject | null;
  rise?: number;
}

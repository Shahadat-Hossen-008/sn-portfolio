import type { PersonalIntroData } from "../../interface";

export interface IPersonalIntroTileProps {
  personalIntro?: NonNullable<PersonalIntroData>["personalIntro"];
  rise?: number;
}

import type { PersonalIntroData } from "../../interface";

export interface IAvailabilityTileProps {
  availability?: NonNullable<PersonalIntroData>["availability"];
  rise?: number;
}

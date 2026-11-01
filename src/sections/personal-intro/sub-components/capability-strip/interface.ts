import type { ICapability } from "../../interface";
import type { TileTone } from "../tile/interface";

export interface ICapabilityStripProps {
  eyebrow?: string | null;
  items: ICapability[];
  rise?: number;
  tone?: TileTone;
}

import { cleanColumns } from "@/sections/engineering-pillars/helpers";
import { EngineeringPillarsSection } from "../index";
import type { IEngineeringPillarsProps } from "../interface";
import type { ISanityEngineeringPillarsProps } from "./interface";

export function EngineeringPillarsSectionBuilder({
  data,
}: ISanityEngineeringPillarsProps) {
  if (!data) return null;

  const columns = cleanColumns(data.columns);
  if (columns.length === 0) return null;

  const props: IEngineeringPillarsProps = {
    columns,
  };

  return <EngineeringPillarsSection {...props} />;
}

export default EngineeringPillarsSectionBuilder;

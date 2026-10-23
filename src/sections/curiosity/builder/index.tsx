import {
  getCuriosityTiles,
  getTileLayout,
  projectRows,
} from "@/sanity/lib/curiosity";
import { splitHeadline } from "@/sanity/lib/hero";
import { CuriositySection } from "../index";
import type { ICuriositySectionProps } from "../interface";
import type { ISanityCuriositySectionProps } from "./interface";

export function CuriositySectionBuilder({
  data,
  latestProjects,
  sectionNumber,
}: ISanityCuriositySectionProps) {
  const heading = data?.heading?.trim();
  const tiles = getCuriosityTiles(data, latestProjects);
  if (!heading || !Object.values(tiles).some(Boolean)) return null;

  const layout = getTileLayout(tiles);
  const headingParts = splitHeadline(heading, data?.headingAccent);
  const eyebrow = data?.eyebrow?.trim() ?? "";
  const eyebrowText =
    sectionNumber === undefined
      ? eyebrow
      : `${String(sectionNumber).padStart(2, "0")} — ${eyebrow}`.trim();
  const projects = projectRows(data?.work?.projects, latestProjects);
  const intro = data?.intro?.trim() || undefined;

  const props: ICuriositySectionProps = {
    data,
    eyebrowText,
    headingParts,
    intro,
    tiles,
    layout,
    projects,
  };

  return <CuriositySection {...props} />;
}

export default CuriositySectionBuilder;

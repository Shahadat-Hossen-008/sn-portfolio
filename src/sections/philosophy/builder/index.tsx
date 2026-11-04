import { PhilosophySection } from "../index";
import type { IPhilosophyItem } from "../interface";
import type { IPhilosophySectionBuilderProps } from "./interface";

export function PhilosophySectionBuilder({
  data,
}: IPhilosophySectionBuilderProps) {
  if (!data || !data.items || data.items.length === 0) {
    return null;
  }

  const items: IPhilosophyItem[] = data.items
    .filter(
      (item): item is typeof item & { title: string; description: string } =>
        Boolean(item && item.title?.trim() && item.description?.trim()),
    )
    .map((item, idx) => ({
      _key: item._key || `phil-${idx}`,
      title: item.title.trim(),
      description: item.description.trim(),
      tag: item.tag?.trim() || null,
    }));

  if (items.length === 0) {
    return null;
  }

  return (
    <PhilosophySection eyebrow={data.eyebrow || "PHILOSOPHY"} items={items} />
  );
}

export default PhilosophySectionBuilder;

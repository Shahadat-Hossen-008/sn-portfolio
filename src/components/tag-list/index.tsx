import type { ITagListProps } from "./interface";

export function TagList({ tags }: ITagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag._id}
          className="inline-flex rounded-full border border-limestone-border px-3 py-1.5 text-base leading-[1.2] text-foreground"
        >
          {tag.label}
        </li>
      ))}
    </ul>
  );
}

export default TagList;

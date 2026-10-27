import { splitHeadline } from "@/lib/hero";
import type { IAccentHeadingProps } from "./interface";

export function AccentHeading({
  as: Component,
  id,
  text,
  accent,
  className,
}: IAccentHeadingProps) {
  const parts = splitHeadline(text, accent);

  return (
    <Component id={id} className={className}>
      {parts.length === 3 ? (
        <>
          {parts[0]}
          <em className="highlight-swipe bento-swipe italic px-1.5">
            {parts[1]}
          </em>
          {parts[2]}
        </>
      ) : (
        text
      )}
    </Component>
  );
}

export default AccentHeading;

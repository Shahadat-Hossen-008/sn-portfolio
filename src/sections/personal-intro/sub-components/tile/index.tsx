import type { ITileProps } from "./interface";

/**
 * Base wrapper for bento grid tiles with semantic surface styling.
 * Applies color tone tokens (`data-tone`), accessibility labeling, and
 * a staggered scroll-driven entrance animation via the `rise` index.
 */
export function Tile({
  children,
  tone,
  labelledBy,
  className = "",
  rise,
}: ITileProps) {
  // `rise` is the stagger index (0-5) controlling the scroll-driven
  // entry animation offset (`--i` in CSS) so tiles cascade in smoothly.
  const riseClass = rise === undefined ? "" : `bento-rise bento-rise--${rise}`;

  return (
    <section
      aria-labelledby={labelledBy}
      data-tone={tone}
      className={`bento-tile ${riseClass} ${className}`.trim()}
    >
      {children}
    </section>
  );
}

export default Tile;

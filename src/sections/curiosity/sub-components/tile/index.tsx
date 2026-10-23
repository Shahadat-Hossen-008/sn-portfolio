import type { ITileProps } from "./interface";

export function Tile({
  children,
  tone,
  labelledBy,
  className = "",
  rise,
}: ITileProps) {
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

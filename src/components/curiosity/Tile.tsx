import type { ReactNode } from "react";

type TileProps = {
  children: ReactNode;
  tone: "flat" | "forest" | "glow" | "cta" | "light";
  labelledBy: string;
  className?: string;
  rise?: number;
};

export default function Tile({
  children,
  tone,
  labelledBy,
  className = "",
  rise,
}: TileProps) {
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

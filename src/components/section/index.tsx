import type { ElementType } from "react";
import type { ISectionProps } from "./interface";

export function Section<T extends ElementType = "section">({
  as,
  tone = "light",
  children,
  className = "",
  ...props
}: ISectionProps<T>) {
  const Component = as ?? "section";

  return (
    <Component
      data-surface={tone === "forest" ? "forest" : undefined}
      className={`bg-background text-foreground ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Section;

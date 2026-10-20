import type { ElementType, HTMLAttributes, ReactNode } from "react";

type SectionProps<T extends ElementType = "section"> = {
  as?: T;
  tone?: "light" | "forest";
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "color">;

export default function Section<T extends ElementType = "section">({
  as,
  tone = "light",
  children,
  className = "",
  ...props
}: SectionProps<T>) {
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

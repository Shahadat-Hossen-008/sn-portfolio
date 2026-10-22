import type { ReactNode } from "react";

export default function Chip({
  children,
  dailyDriver = false,
  nested = false,
}: {
  children: ReactNode;
  dailyDriver?: boolean;
  nested?: boolean;
}) {
  const spacing = nested ? "px-3 py-1.5" : "px-3.5 py-2";

  return (
    <li
      className={`inline-flex items-center rounded-full border border-forest-border ${spacing} font-sans text-base leading-[1.2] text-limestone`}
    >
      {dailyDriver && (
        <i aria-hidden="true" className="mr-2 size-1.5 shrink-0 rounded-full bg-mint" />
      )}
      {children}
      {dailyDriver && <span className="sr-only"> (daily driver)</span>}
    </li>
  );
}

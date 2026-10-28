import type { IOutcomeStateProps } from "./interface";

/**
 * Reusable outcome state grid following exact 1px
 * `gap-px bg-border border border-border` unified frame design.
 */
export function OutcomeStateBlock({ heading, stats }: IOutcomeStateProps) {
  const validStats = (stats ?? []).filter(
    (stat) => Boolean(stat?.value?.trim()) && Boolean(stat?.label?.trim()),
  );

  if (validStats.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      {heading?.trim() && (
        <h3 className="mb-4 font-display text-title font-normal text-foreground">
          {heading.trim()}
        </h3>
      )}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-px border border-border bg-border">
        {validStats.map((stat, index) => (
          <div
            key={stat._key || index}
            className="bg-surface px-4 py-5 text-center"
          >
            <div className="font-display text-title font-normal text-foreground">
              {stat.value}
            </div>
            <div className="mt-1.5 font-mono text-label uppercase tracking-[0.08em] text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OutcomeStateBlock;

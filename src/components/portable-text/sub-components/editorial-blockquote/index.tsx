import type { IEditorialBlockquoteProps } from "./interface";

/**
 * Shared editorial blockquote used across top-level and nested Portable Text.
 *
 * - Preserves the original blockquote visual treatment (`rounded-2xl bg-surface border-l-2 border-mint p-6 sm:p-8 text-foreground text-base sm:text-lg leading-relaxed shadow-sm`).
 * - Uses the full available width of the editorial renderer (`w-full min-w-0`) without
 *   competing nested `max-width` constraints.
 * - Preserves attribution and Portable Text formatting when provided.
 */
export function EditorialBlockquote({
  children,
  attribution,
}: IEditorialBlockquoteProps) {
  const cleanAttribution = attribution?.trim() || null;

  return (
    <blockquote
      data-editorial-blockquote="true"
      className="my-8 w-full min-w-0 rounded-2xl bg-surface border-l-2 border-mint p-6 sm:p-8 text-foreground text-base sm:text-lg leading-relaxed shadow-sm"
    >
      <div className="[&>p]:mb-3 [&>p:last-child]:mb-0">{children}</div>
      {cleanAttribution && (
        <footer className="mt-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          — <cite className="not-italic">{cleanAttribution}</cite>
        </footer>
      )}
    </blockquote>
  );
}

export default EditorialBlockquote;

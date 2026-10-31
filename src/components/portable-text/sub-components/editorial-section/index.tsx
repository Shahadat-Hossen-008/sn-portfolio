import { PortableText } from "next-sanity";
import { formatEditorialLabel } from "../../numbering";
import { inlinePortableTextComponents } from "../inline-components";
import type { IEditorialSectionProps } from "./interface";

/**
 * Renders an Editorial Section inside Portable Text.
 *
 * - `twoColumn` (default): Asymmetric 5fr / 7fr split matching the project
 *   detail case study layout (numbered monospace label on the left, Fraunces
 *   display heading + narrative body on the right).
 * - `straightforward`: Single-column narrative flow with optional eyebrow
 *   label and display heading.
 */
export function EditorialSectionBlock({
  layout = "twoColumn",
  label,
  autoNumber = true,
  stepNumber,
  heading,
  body,
}: IEditorialSectionProps) {
  const hasHeading = Boolean(heading?.trim());
  const hasBody = Array.isArray(body) && body.length > 0;

  if (!hasHeading && !hasBody && !label?.trim()) {
    return null;
  }

  const formattedLabel = formatEditorialLabel(
    label,
    autoNumber === false ? null : stepNumber,
  );

  if (layout === "straightforward") {
    return (
      <section className="my-12 border-t border-foreground/20 pt-10">
        <div className="flex max-w-3xl flex-col gap-4">
          {formattedLabel && (
            <p className="font-mono text-label uppercase text-muted-foreground">
              {formattedLabel}
            </p>
          )}
          {hasHeading && (
            <h2 className="font-display text-title font-normal text-balance text-foreground">
              {heading}
            </h2>
          )}
          {hasBody && (
            <div className="mt-1">
              <PortableText
                value={body}
                components={inlinePortableTextComponents}
              />
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="my-12 border-t border-foreground/20 pt-10">
      <div className="grid grid-cols-1 gap-8 bento:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] bento:gap-16">
        <div>
          {formattedLabel && (
            <p className="font-mono text-label uppercase text-muted-foreground">
              {formattedLabel}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-5">
          {hasHeading && (
            <h2 className="font-display text-title font-normal text-balance text-foreground">
              {heading}
            </h2>
          )}
          {hasBody && (
            <div>
              <PortableText
                value={body}
                components={inlinePortableTextComponents}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default EditorialSectionBlock;

import { PortableText } from "next-sanity";
import { formatEditorialLabel } from "../../numbering";
import { inlinePortableTextComponents } from "../inline-components";
import type { IEditorialSectionProps } from "./interface";

/**
 * Renders an Editorial Section inside Portable Text using a unified
 * single-column reading structure:
 * 1. Section label (above heading)
 * 2. Section heading (above body content)
 * 3. Rich Text / Portable Text body content
 *
 * Uses the available width of the parent editorial renderer (`w-full min-w-0`)
 * so all editorial sections share one consistent left alignment and reading order.
 */
export function EditorialSectionBlock({
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

  return (
    <section
      data-editorial-section="single"
      className="my-10 w-full min-w-0"
    >
      <div className="flex w-full min-w-0 flex-col gap-4">
        {formattedLabel && (
          <p className="font-mono text-label uppercase text-muted-foreground">
            {formattedLabel}
          </p>
        )}
        {hasHeading && (
          <h2 className="w-full font-display text-2xl sm:text-3xl font-semibold text-balance text-foreground">
            {heading}
          </h2>
        )}
        {hasBody && (
          <div className="mt-1 w-full min-w-0 [&>*:first-child]:mt-0">
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

export default EditorialSectionBlock;

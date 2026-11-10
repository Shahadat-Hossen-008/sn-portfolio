import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { PortableText, type PortableTextBlock } from "next-sanity";
import Image from "next/image";

import { isSupportedReactPlayerUrl } from "@/sanity/_root/portableText/iframe/videoUrl";
import { urlFor } from "@/sanity/lib/image";
import { YouTube } from "@/components/youtube";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { PortableTable } from "@/components/portable-table";
import type {
  IPortableTableHeader,
  IPortableTableRow,
} from "@/components/portable-table/interface";
import { EditorialSectionBlock } from "./sub-components/editorial-section";
import { DecisionCardsBlock } from "./sub-components/decision-cards";
import type { IDecisionCardItem } from "./sub-components/decision-cards/interface";
import { OutcomeStateBlock } from "./sub-components/outcome-state";
import type { IOutcomeStateItem } from "./sub-components/outcome-state/interface";
import {
  editorialBlockComponents,
  editorialListComponents,
  editorialMarkComponents,
  isRecord,
  renderEditorialCodeOrMermaid,
} from "./sub-components/inline-components";
import { assignEditorialSectionNumbers } from "./numbering";
import type {
  ICustomPortableTextProps,
  IPortableTextComponents,
  IPortableTextTypedObject,
} from "./interface";

/**
 * Shared class string for the complete Rich Text Editorial renderer wrapper.
 *
 * Respects the available width of its parent container without imposing an
 * independent maximum width or auto-margin centering:
 * - `w-full`: 100% of available parent width
 * - `min-w-0`: prevents flex/grid children from forcing parent expansion
 */
export const EDITORIAL_RENDERER_CLASS =
  "w-full min-w-0 [&>*:first-child]:mt-0";

function isSanityImageSource(value: unknown): value is SanityImageSource {
  if (!isRecord(value) || !isRecord(value.asset)) return false;

  return (
    typeof value.asset._ref === "string" ||
    typeof value.asset._id === "string" ||
    typeof value.asset.url === "string"
  );
}

function portableTextImageUrl(value: unknown): string | null {
  if (!isRecord(value) || !isSanityImageSource(value.imageFile)) return null;

  try {
    return urlFor(value.imageFile).width(1200).quality(85).auto("format").url();
  } catch {
    return null;
  }
}

function renderPortableTextImage(value: unknown) {
  const src = portableTextImageUrl(value);
  if (!src) return null;

  const alt =
    isRecord(value) && typeof value.altText === "string" ? value.altText : "";
  const caption =
    isRecord(value) && typeof value.caption === "string" && value.caption.trim()
      ? value.caption.trim()
      : null;

  return (
    <figure className="my-8 w-full min-w-0">
      <Image
        className="w-full h-auto rounded-xl border border-foreground/10 object-cover"
        src={src}
        alt={alt}
        width={1200}
        height={750}
      />
      {caption && (
        <figcaption className="mt-2.5 font-mono text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Creates a `PortableTextReactComponents` map with pre-computed sequential
 * `01 — LABEL` numbers across all `editorialSection` blocks in `blocks`.
 * Also works without `blocks` by falling back to `index`-based numbering.
 */
export function createPortableTextComponents(
  blocks?: ReadonlyArray<unknown> | null,
): IPortableTextComponents {
  const sectionNumbers = Array.isArray(blocks)
    ? assignEditorialSectionNumbers(blocks)
    : null;

  return {
    types: {
      youtube: ({ value }) =>
        isRecord(value) && isSupportedReactPlayerUrl(value.url) ? (
          <YouTube url={value.url} />
        ) : null,

      customImage: ({ value }) => renderPortableTextImage(value),
      portableImage: ({ value }) => renderPortableTextImage(value),
      portableTextImage: ({ value }) => renderPortableTextImage(value),

      code: ({ value }) => renderEditorialCodeOrMermaid(value),

      mermaidDiagram: ({ value }) => {
        if (!isRecord(value) || typeof value.code !== "string") return null;
        const caption =
          typeof value.caption === "string" ? value.caption : undefined;
        return <MermaidDiagram code={value.code} caption={caption} />;
      },

      editorialSection: ({ value, index }) => {
        if (!isRecord(value)) return null;

        const stepNumber =
          value.autoNumber === false
            ? null
            : sectionNumbers
              ? (sectionNumbers[index] ?? null)
              : typeof index === "number"
                ? index + 1
                : 1;

        return (
          <EditorialSectionBlock
            layout={
              typeof value.layout === "string"
                ? value.layout
                : "straightforward"
            }
            label={typeof value.label === "string" ? value.label : undefined}
            autoNumber={
              typeof value.autoNumber === "boolean" ? value.autoNumber : true
            }
            stepNumber={stepNumber}
            heading={
              typeof value.heading === "string" ? value.heading : undefined
            }
            body={
              Array.isArray(value.body)
                ? (value.body as PortableTextBlock[])
                : undefined
            }
          />
        );
      },

      decisionCards: ({ value }) => {
        if (!isRecord(value) || !Array.isArray(value.cards)) return null;
        return (
          <DecisionCardsBlock cards={value.cards as IDecisionCardItem[]} />
        );
      },

      outcomeState: ({ value }) => {
        if (!isRecord(value) || !Array.isArray(value.stats)) return null;
        return (
          <OutcomeStateBlock
            heading={
              typeof value.heading === "string" ? value.heading : undefined
            }
            stats={value.stats as IOutcomeStateItem[]}
          />
        );
      },

      portableTable: ({ value }) => {
        if (!isRecord(value)) return null;
        return (
          <PortableTable
            caption={
              typeof value.caption === "string" ? value.caption : undefined
            }
            columnHeaders={
              Array.isArray(value.columnHeaders)
                ? (value.columnHeaders as IPortableTableHeader[])
                : undefined
            }
            rows={
              Array.isArray(value.rows)
                ? (value.rows as IPortableTableRow[])
                : undefined
            }
          />
        );
      },
    },

    block: editorialBlockComponents,
    marks: editorialMarkComponents,
    list: editorialListComponents,
  };
}

export const portableTextComponents: IPortableTextComponents =
  createPortableTextComponents();

/**
 * Shared Rich Text Editorial renderer wrapper.
 *
 * Respects the full available width of its parent container (`w-full min-w-0`)
 * without imposing an independent `max-w-reading` (768px) or `mx-auto` constraint.
 */
export function CustomPortableText<
  B extends IPortableTextTypedObject = PortableTextBlock,
>({ value, components, className }: ICustomPortableTextProps<B>) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  const resolvedComponents =
    components ??
    createPortableTextComponents(Array.isArray(value) ? value : [value]);

  return (
    <div
      data-editorial-renderer="true"
      className={
        className
          ? `${EDITORIAL_RENDERER_CLASS} ${className}`
          : EDITORIAL_RENDERER_CLASS
      }
    >
      <PortableText value={value} components={resolvedComponents} />
    </div>
  );
}

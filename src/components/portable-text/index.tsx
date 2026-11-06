import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { PortableText, type PortableTextBlock } from "next-sanity";
import Image from "next/image";

import { isSupportedReactPlayerUrl } from "@/sanity/_root/portableText/iframe/videoUrl";
import { urlFor } from "@/sanity/lib/image";
import { resolveLink } from "@/lib/sanity/links";
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
import { isRecord, isSanityLink } from "./sub-components/inline-components";
import { assignEditorialSectionNumbers } from "./numbering";
import type { IPortableTextComponents } from "./interface";

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
    return urlFor(value.imageFile)
      .width(600)
      .height(400)
      .quality(80)
      .auto("format")
      .url();
  } catch {
    return null;
  }
}

function renderPortableTextImage(value: unknown) {
  const src = portableTextImageUrl(value);
  if (!src) return null;

  const alt =
    isRecord(value) && typeof value.altText === "string" ? value.altText : "";

  return (
    <Image
      className="rounded-lg h-auto my-10 mx-auto"
      src={src}
      alt={alt}
      width={600}
      height={400}
    />
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

      code: ({ value }) => {
        if (!isRecord(value) || typeof value.code !== "string") return null;

        const filename =
          typeof value.filename === "string" ? value.filename : null;
        const language =
          typeof value.language === "string" ? value.language : undefined;

        if (language === "mermaid") {
          return <MermaidDiagram code={value.code} caption={filename} />;
        }

        return (
          <figure className="my-8 overflow-hidden rounded-xl border border-limestone/15 bg-soft-forest text-limestone shadow-sm">
            {filename && (
              <figcaption className="border-b border-limestone/10 bg-forest/40 px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted-sage">
                {filename}
              </figcaption>
            )}
            <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-limestone">
              <code className={language ? `language-${language}` : undefined}>
                {value.code}
              </code>
            </pre>
          </figure>
        );
      },

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
              typeof value.layout === "string" ? value.layout : "twoColumn"
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

    block: {
      h1: ({ children }) => (
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mt-8 mb-4">
          {children}
        </h2>
      ),
      h2: ({ children }) => (
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mt-6 mb-3">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mt-5 mb-2">
          {children}
        </h3>
      ),
      normal: ({ children }) => (
        <p className="text-base leading-relaxed mb-4 text-muted-foreground last:mb-0">
          {children}
        </p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-8 rounded-2xl bg-surface border-l-2 border-mint p-6 sm:p-8 text-foreground text-base sm:text-lg leading-relaxed shadow-sm">
          {children}
        </blockquote>
      ),
    },

    marks: {
      strong: ({ children }) => (
        <strong className="font-bold text-foreground">{children}</strong>
      ),
      highlight: ({ children }) => (
        <span className="rounded bg-mint/35 px-1.5 py-0.5 font-medium text-foreground box-decoration-clone">
          {children}
        </span>
      ),
      linkUrl: ({ value, children }) => {
        if (!isSanityLink(value)) return <span>{children}</span>;

        const href = resolveLink(value);
        if (!href) return <span>{children}</span>;

        const openInNewTab = value.openInNewTab === true;

        return (
          <a
            href={href}
            target={openInNewTab ? "_blank" : undefined}
            rel={openInNewTab ? "noopener noreferrer" : undefined}
            className="link-hover-underline font-medium text-foreground transition-opacity hover:opacity-85"
          >
            {children}
          </a>
        );
      },
    },

    list: {
      bullet: ({ children }) => (
        <ul className="list-disc ml-6 mb-4 text-muted-foreground">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal ml-6 mb-4 text-muted-foreground">
          {children}
        </ol>
      ),
    },
  };
}

export const portableTextComponents: IPortableTextComponents =
  createPortableTextComponents();

export function CustomPortableText({
  value,
  components = portableTextComponents,
}: {
  value?: PortableTextBlock[] | null;
  components?: IPortableTextComponents;
}) {
  if (!value) return null;
  return <PortableText value={value} components={components} />;
}

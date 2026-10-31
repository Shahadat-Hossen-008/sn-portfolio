import { AccentHeading } from "@/components/accent-heading";
import type { IQuoteProps } from "./interface";

export function QuoteSection({ quote, quoteAccent, note }: IQuoteProps) {
  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-page px-8">
        <figure className="border-y border-foreground/20 py-16 grid grid-cols-1 gap-16 bento:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] bento:items-end">
          <blockquote>
            <span
              aria-hidden="true"
              className="mb-4 block h-8 overflow-hidden font-display text-[64px] leading-none"
            >
              “
            </span>
            <AccentHeading
              as="p"
              text={quote}
              accent={quoteAccent}
              className="font-display text-heading font-normal text-balance"
            />
          </blockquote>
          {note && (
            <figcaption className="text-base leading-[1.6] text-muted-foreground max-w-70">
              {note}
            </figcaption>
          )}
        </figure>
      </div>
    </div>
  );
}

export default QuoteSection;

import { QuoteSection } from "../index";
import type { IQuoteProps } from "../interface";
import type { ISanityQuoteProps } from "./interface";

export function QuoteSectionBuilder({ data }: ISanityQuoteProps) {
  const quote = data?.quote?.trim();
  if (!quote) return null;

  const props: IQuoteProps = {
    quote,
    quoteAccent: data.quoteAccent,
    note: data.note?.trim() || undefined,
  };

  return <QuoteSection {...props} />;
}

export default QuoteSectionBuilder;

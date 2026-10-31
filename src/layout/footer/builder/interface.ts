import type { Layout } from "../../interface";

export interface ISanityFooterProps {
  layout: Pick<NonNullable<Layout>, "identity" | "footer"> | null;
}

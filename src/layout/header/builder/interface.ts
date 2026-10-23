import type { Layout } from "../../interface";

export interface ISanityHeaderProps {
  layout: Pick<NonNullable<Layout>, "identity" | "header"> | null;
}

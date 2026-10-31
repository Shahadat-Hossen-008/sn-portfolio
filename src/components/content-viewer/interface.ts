import type { ReactNode } from "react";

export interface IContentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
}

export interface IMermaidDiagramProps {
  /** Mermaid syntax string to render. */
  code: string;
  /** Optional caption or title displayed in the diagram header bar. */
  caption?: string | null;
}

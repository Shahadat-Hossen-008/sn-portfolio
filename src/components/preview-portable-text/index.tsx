import type { IPreviewPortableTextMarkProps } from "./interface";

/**
 * This file contains the components used to render the portable text link mark
 * which is used to stop generating any links in the preview of the portable text,
 * preventing nested anchor errors when rendering inside a blog card Link.
 */
export const previewPortableTextComponents = {
  types: {
    code: () => null,
    customImage: () => null,
    portableImage: () => null,
    portableTextImage: () => null,
    youtube: () => null,
    editorialSection: () => null,
    decisionCards: () => null,
    outcomeState: () => null,
    portableTable: () => null,
    mermaidDiagram: () => null,
  },
  marks: {
    linkUrl: ({ children }: IPreviewPortableTextMarkProps) => {
      return <span className="text-muted-foreground">{children}</span>;
    },
  },
};

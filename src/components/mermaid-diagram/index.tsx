"use client";

import { useState } from "react";
import { FiMaximize2 } from "react-icons/fi";
import { ContentViewer } from "@/components/content-viewer";
import { useMermaidRender } from "./use-mermaid-render";
import { MAX_MERMAID_UPSCALE } from "./use-mermaid-render/constants";
import type { IMermaidDiagramProps } from "./interface";

/**
 * Inline diagram rendered from Mermaid syntax with Limestone & Forest styling
 * and a fullscreen zoom/pan viewer on click.
 */
export function MermaidDiagram({ code, caption }: IMermaidDiagramProps) {
  const { svg, error, naturalWidth } = useMermaidRender(code);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (error) {
    return (
      <div className="my-8 overflow-hidden rounded-row border border-border/50 bg-surface">
        <div className="flex items-center gap-2 border-b border-border/35 bg-foreground/5 px-4 py-2">
          <span className="font-mono text-label uppercase text-foreground">
            Diagram Syntax Error
          </span>
        </div>
        <pre className="m-0 overflow-x-auto bg-background p-4 font-mono text-caption leading-[1.6] text-muted-foreground whitespace-pre-wrap">
          <code>{error}</code>
        </pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading diagram"
        className="my-8 overflow-hidden rounded-row border border-border/40 bg-surface animate-pulse"
      >
        <div className="h-48 bg-background/60" />
      </div>
    );
  }

  return (
    <>
      <figure className="my-8 overflow-hidden rounded-row border border-border/40 bg-background">
        <div className="flex items-center justify-between border-b border-border/35 bg-surface px-4 py-2">
          <figcaption className="font-mono text-label uppercase text-muted-foreground">
            {caption?.trim() || "Architecture Diagram"}
          </figcaption>
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="inline-flex items-center gap-1.5 font-mono text-label uppercase text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            <span>Inspect</span>
            <FiMaximize2 className="size-3.5" aria-hidden="true" />
            <span className="sr-only">View diagram fullscreen</span>
          </button>
        </div>

        <div
          className="flex min-h-40 cursor-pointer items-center justify-center p-6"
          onClick={() => setIsFullscreen(true)}
          role="button"
          tabIndex={0}
          aria-label={
            caption?.trim()
              ? `Expand diagram: ${caption.trim()}`
              : "Expand diagram fullscreen"
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsFullscreen(true);
            }
          }}
        >
          <div
            className="[&>svg]:h-auto [&>svg]:max-w-none!"
            style={{
              width:
                naturalWidth > 0
                  ? `min(100%, ${naturalWidth * MAX_MERMAID_UPSCALE}px)`
                  : "100%",
            }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </figure>

      <ContentViewer
        open={isFullscreen}
        onOpenChange={setIsFullscreen}
        title={caption?.trim() || "Architecture Diagram"}
      >
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      </ContentViewer>
    </>
  );
}

export default MermaidDiagram;

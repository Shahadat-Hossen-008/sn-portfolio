"use client";

import { useEffect, useRef } from "react";
import { FiMinus, FiPlus, FiRotateCcw, FiX } from "react-icons/fi";
import { useZoomPan } from "./use-zoom-pan";
import type { IContentViewerProps } from "./interface";

const TOOLBAR_BTN =
  "p-1.5 rounded-md hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer";

/**
 * Fullscreen modal viewer with zoom and pan controls for inspecting
 * architecture diagrams and detailed visual artifacts.
 */
export function ContentViewer({
  open,
  onOpenChange,
  title,
  children,
}: IContentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const {
    zoom,
    displayZoom,
    pan,
    zoomIn,
    zoomOut,
    fitToViewport,
    panAreaProps,
  } = useZoomPan({
    containerRef,
    wrapperRef,
    zoomable: open,
    pannable: open,
  });

  useEffect(() => {
    if (!open) return;

    const raf = requestAnimationFrame(() => fitToViewport());
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, fitToViewport, onOpenChange]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || "Fullscreen diagram viewer"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-forest/75 p-4 backdrop-blur-xs sm:p-8"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative h-[85vh] w-full max-w-[92vw] overflow-hidden rounded-nested border border-border/50 bg-background shadow-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div
          className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-row border border-border/40 bg-surface/95 px-2.5 py-1.5 shadow-button backdrop-blur-xs"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={zoomOut}
            disabled={displayZoom <= 0}
            className={TOOLBAR_BTN}
            aria-label="Zoom out"
          >
            <FiMinus className="size-4" />
          </button>
          <span className="w-12 text-center font-mono text-label text-muted-foreground tabular-nums select-none">
            {Math.round(displayZoom * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= 10}
            className={TOOLBAR_BTN}
            aria-label="Zoom in"
          >
            <FiPlus className="size-4" />
          </button>
          <button
            type="button"
            onClick={fitToViewport}
            className={TOOLBAR_BTN}
            aria-label="Reset zoom"
          >
            <FiRotateCcw className="size-4" />
          </button>
          <div className="mx-1 h-4 w-px bg-border/40" />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className={TOOLBAR_BTN}
            aria-label="Close fullscreen viewer"
          >
            <FiX className="size-4" />
          </button>
        </div>

        {/* Zoom/Pan Canvas */}
        <div
          ref={containerRef}
          className="absolute inset-0"
          {...panAreaProps}
        >
          <div
            ref={wrapperRef}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center center",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentViewer;

import type { RefObject } from "react";

export interface UseZoomPanOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  wrapperRef: RefObject<HTMLDivElement | null>;
  zoomable: boolean;
  pannable: boolean;
}

export interface UseZoomPanResult {
  zoom: number;
  displayZoom: number;
  pan: { x: number; y: number };
  zoomIn: () => void;
  zoomOut: () => void;
  fitToViewport: () => void;
  panAreaProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    style: { cursor: "grabbing" | "grab" | "default" };
  };
}

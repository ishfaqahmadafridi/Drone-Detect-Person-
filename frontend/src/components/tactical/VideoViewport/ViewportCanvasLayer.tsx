"use client";

import React from "react";
import { ViewportCanvasLayerProps } from "@/types";

export const ViewportCanvasLayer: React.FC<ViewportCanvasLayerProps> = ({
  canvasRef,
  isEditingZone,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
}) => {
  return (
    <canvas
      ref={canvasRef}
      width={1280}
      height={720}
      onMouseDown={onCanvasMouseDown}
      onMouseMove={onCanvasMouseMove}
      onMouseUp={onCanvasMouseUp}
      className={`absolute inset-0 w-full h-full z-10 ${
        isEditingZone ? "cursor-crosshair" : "pointer-events-none"
      }`}
    />
  );
};

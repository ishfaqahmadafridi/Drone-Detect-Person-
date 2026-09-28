"use client";

import React from "react";
import { ViewportHudReticleProps } from "@/types";

export const ViewportHudReticle: React.FC<ViewportHudReticleProps> = ({ className = "" }) => {
  return (
    <div className={`pointer-events-none ${className}`}>
      {/* Tactical Corner Brackets */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400/80" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400/80" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400/80" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400/80" />

      {/* Center Targeting Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-dashed border-cyan-400/30" />
    </div>
  );
};

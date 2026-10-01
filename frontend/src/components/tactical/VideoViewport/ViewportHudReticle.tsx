"use client";

import React from "react";
import { ViewportHudReticleProps } from "@/types";

export const ViewportHudReticle: React.FC<ViewportHudReticleProps> = ({ className = "" }) => {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      {/* Unobtrusive 1px Corner Reference Markers (Professional Camera Framing) */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/20" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/20" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/20" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/20" />
    </div>
  );
};

export default ViewportHudReticle;

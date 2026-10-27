"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { ViewportHudReticleProps } from "@/types";

export const ViewportHudReticle: React.FC<ViewportHudReticleProps> = ({ className = "" }) => {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      {/* Unobtrusive 1px Corner Reference Markers (Professional Camera Framing) */}
      <div className={TACTICAL_VIEW_STYLES.ViewportHudReticle_div_className} />
      <div className={TACTICAL_VIEW_STYLES.ViewportHudReticle_div_className_2} />
      <div className={TACTICAL_VIEW_STYLES.ViewportHudReticle_div_className_3} />
      <div className={TACTICAL_VIEW_STYLES.ViewportHudReticle_div_className_4} />
    </div>
  );
};

export default ViewportHudReticle;

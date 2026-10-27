"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { ViewportPerspectiveBadgeProps } from "@/types";

export const PerspectiveBadge: React.FC<ViewportPerspectiveBadgeProps> = ({
  viewMode = "aerial",
}) => {
  const isGround = viewMode === "ground";

  return (
    <span
      className={`font-mono-code text-[10px] px-2 py-0.5 rounded border uppercase font-semibold ${
        isGround
          ? TACTICAL_VIEW_STYLES.PerspectiveBadge_span_className
          : TACTICAL_VIEW_STYLES.PerspectiveBadge_span_className_2
      }`}
    >
      {isGround ? "GROUND CCTV" : "AERIAL DRONE"}
    </span>
  );
};

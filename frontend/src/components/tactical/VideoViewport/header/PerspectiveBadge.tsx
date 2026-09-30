"use client";

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
          ? "bg-blue-500/15 text-blue-400 border-blue-500/40"
          : "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
      }`}
    >
      {isGround ? "GROUND CCTV" : "AERIAL DRONE"}
    </span>
  );
};

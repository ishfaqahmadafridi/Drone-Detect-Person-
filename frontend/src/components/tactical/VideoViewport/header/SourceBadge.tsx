"use client";

import React from "react";
import { ViewportSourceBadgeProps } from "@/types";

export const SourceBadge: React.FC<ViewportSourceBadgeProps> = ({ sourceType }) => {
  return (
    <span className="font-mono-code text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded">
      {sourceType.toUpperCase()}
    </span>
  );
};

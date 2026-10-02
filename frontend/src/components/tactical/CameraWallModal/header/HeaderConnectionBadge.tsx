"use client";

import React from "react";
import { HeaderConnectionBadgeProps } from "@/types";

export const HeaderConnectionBadge: React.FC<HeaderConnectionBadgeProps> = ({
  connectedCount,
  totalCount,
}) => {
  return (
    <div className="px-2.5 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-mono-code text-xs font-bold flex items-center gap-1.5 shadow-sm">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <span>
        {connectedCount}/{totalCount} CONNECTED
      </span>
    </div>
  );
};

export default HeaderConnectionBadge;

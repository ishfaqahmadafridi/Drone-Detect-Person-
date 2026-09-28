"use client";

import React from "react";
import { SidebarNavItemProps } from "@/types";

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isActive,
  isCollapsed,
  threatLevel,
  onSelect,
}) => {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onSelect(item.id)}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg font-display text-xs font-semibold tracking-wide transition-all ${
        isActive
          ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent"
      } ${isCollapsed ? "justify-center px-0" : ""}`}
      title={item.label}
    >
      {/* Active Indicator Bar */}
      {isActive && (
        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cyan-400 rounded-r shadow-[0_0_8px_#06b6d4]" />
      )}

      <Icon
        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
          isActive ? "text-cyan-300" : "text-slate-400 group-hover:text-slate-200"
        }`}
      />

      {!isCollapsed && <span className="truncate uppercase tracking-wider">{item.label}</span>}

      {/* Threat Alert Badge */}
      {!isCollapsed && item.id === "incidents" && threatLevel !== "CLEAR" && (
        <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold bg-red-500/30 text-red-300 border border-red-500/50 animate-pulse">
          ALERT
        </span>
      )}
    </button>
  );
};

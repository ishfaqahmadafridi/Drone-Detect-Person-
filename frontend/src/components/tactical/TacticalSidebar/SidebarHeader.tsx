"use client";

import React from "react";
import { SidebarHeaderProps } from "@/types";
import { Shield, ChevronLeft, ChevronRight, Radio, Camera } from "lucide-react";

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
  flightState,
  isAirborne,
  viewMode = "aerial",
}) => {
  const isGround = viewMode === "ground";
  return (
    <div className="flex flex-col border-b border-slate-800/80 p-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="relative p-2 rounded-lg bg-cyan-950/60 border border-cyan-400/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] shrink-0">
            <Shield className="w-5 h-5 text-cyan-300" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-display font-black text-sm tracking-widest text-white uppercase truncate">
                AERO-GUARD
              </span>
              <span className="font-mono-code text-[10px] text-cyan-400/80 tracking-wider truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                DEFENSE HUD v2.5
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors shrink-0"
          title={isCollapsed ? "Expand Tactical Sidebar" : "Collapse Sidebar"}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Tactical Airspace / Perimeter Status Banner */}
      {!isCollapsed && (
        <div className="mt-3 px-2.5 py-1.5 rounded-md bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[11px] font-mono-code">
          <span className="text-slate-400 flex items-center gap-1.5">
            {isGround ? (
              <>
                <Camera className="w-3 h-3 text-emerald-400 animate-pulse" />
                CAM LINK:
              </>
            ) : (
              <>
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                UAV LINK:
              </>
            )}
          </span>
          <span
            className={`font-bold px-1.5 py-0.5 rounded text-[10px] uppercase ${
              isGround
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : isAirborne
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}
          >
            {isGround ? "ONLINE" : flightState}
          </span>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;

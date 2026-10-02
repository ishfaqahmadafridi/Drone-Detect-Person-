"use client";

import React from "react";
import { CameraCardActionsProps } from "@/types";
import { CheckCircle2, PlusCircle, XCircle } from "lucide-react";

export const CardActions: React.FC<CameraCardActionsProps> = ({
  isActive,
  isConnected,
  onSelect,
  onToggleConnect,
}) => {
  return (
    <div className="flex items-center gap-2 mt-1">
      {isConnected ? (
        <>
          {/* Already Connected: Option to Set as Primary or Disconnect */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className={`flex-1 py-2 px-3 rounded-lg font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              isActive
                ? "bg-blue-600/30 border border-blue-500/60 text-blue-200 cursor-default"
                : "bg-emerald-600/30 hover:bg-blue-600 text-emerald-200 hover:text-white border border-emerald-500/60 shadow-sm cursor-pointer"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>{isActive ? "ACTIVE PRIMARY" : "SET AS PRIMARY"}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleConnect();
            }}
            title="Disconnect camera from simultaneous multi-view"
            className="py-2 px-2.5 rounded-lg font-display text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 cursor-pointer transition-all"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>UNLINK</span>
          </button>
        </>
      ) : (
        <>
          {/* Not Connected: One-Click Multi-Camera Connect */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleConnect();
            }}
            className="w-full py-2 px-3 rounded-lg font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white border border-emerald-400 shadow-md cursor-pointer transition-all shadow-emerald-950/40"
          >
            <PlusCircle className="w-4 h-4" />
            <span>CONNECT SENSOR (MULTI-LIVE)</span>
          </button>
        </>
      )}
    </div>
  );
};

export default CardActions;

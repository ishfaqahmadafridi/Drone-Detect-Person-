"use client";

import React from "react";
import { PerimeterDeckHeaderProps } from "@/types";
import { ShieldCheck, Eye } from "lucide-react";

export const PerimeterDeckHeader: React.FC<PerimeterDeckHeaderProps> = ({
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-between border-b border-slate-800/80 pb-3 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
        </div>
        <div>
          <h2 className="font-display font-black text-sm tracking-wider text-slate-100 uppercase">
            PERIMETER CCTV CONTROL DECK
          </h2>
          <p className="text-[10px] font-mono-code text-slate-400">
            Ground Security Optical & Tactical Directives
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono-code font-bold text-emerald-400">
        <Eye className="w-3 h-3 text-emerald-400" />
        <span>FIXED SURVEILLANCE</span>
      </div>
    </div>
  );
};

export default PerimeterDeckHeader;

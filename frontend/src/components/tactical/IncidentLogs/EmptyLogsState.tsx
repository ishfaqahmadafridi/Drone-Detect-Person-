import React from "react";
import { ShieldCheck } from "lucide-react";

export const EmptyLogsState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-7 gap-2 border border-dashed border-slate-800/80 rounded-lg bg-slate-950/40">
      <ShieldCheck className="w-5 h-5 text-emerald-400/70" />
      <span className="text-xs text-slate-300 font-mono-code font-semibold tracking-wide">
        AIRSPACE SECURE • NO INCIDENTS
      </span>
      <span className="text-[10px] text-slate-500 font-mono-code">
        Restricted-zone intrusion events appear here.
      </span>
    </div>
  );
};

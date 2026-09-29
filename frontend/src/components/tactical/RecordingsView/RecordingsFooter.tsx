"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { RecordingsFooterProps } from "@/types";

export const RecordingsFooter: React.FC<RecordingsFooterProps> = ({ totalCount }) => {
  return (
    <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-slate-900/40 border border-slate-800/40 text-[10px] font-mono-code text-slate-500">
      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
      <span>
        Records are auto-saved on INTRUSION or GATHERING threat events.
        Timestamps are in local system time. Total stored:{" "}
        <span className="text-slate-300 font-bold">{totalCount}</span> frame
        {totalCount !== 1 ? "s" : ""}.
      </span>
    </div>
  );
};

export default RecordingsFooter;

"use client";

import React from "react";
import { Clock } from "lucide-react";
import { ListItemTimestampProps } from "@/types";
import { parseEvidenceTimestamp } from "@/utils";

export const ListItemTimestamp: React.FC<ListItemTimestampProps> = ({ createdAt }) => {
  const { datePart, timePart } = parseEvidenceTimestamp(createdAt);

  return (
    <div className="flex items-center gap-1.5 text-slate-100 mb-0.5">
      <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
      <span className="font-mono-code text-xs font-bold tracking-wider text-cyan-300">
        {timePart}
      </span>
      <span className="text-[10px] font-mono-code text-slate-400">
        {datePart}
      </span>
    </div>
  );
};

export default ListItemTimestamp;

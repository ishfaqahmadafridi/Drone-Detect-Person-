"use client";

import React from "react";
import { HardDrive } from "lucide-react";
import { ListItemFooterProps } from "@/types";

export const ListItemFooter: React.FC<ListItemFooterProps> = ({ sizeKb, filename }) => {
  return (
    <div className="flex items-center gap-2 text-[9px] font-mono-code text-slate-500">
      <span className="flex items-center gap-1">
        <HardDrive className="w-2.5 h-2.5 text-slate-400" />
        {sizeKb} KB
      </span>
      <span className="truncate max-w-[120px] text-slate-400">
        {filename}
      </span>
    </div>
  );
};

export default ListItemFooter;

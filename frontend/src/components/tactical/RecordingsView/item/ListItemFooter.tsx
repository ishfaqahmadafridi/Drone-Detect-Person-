"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { HardDrive } from "lucide-react";
import { ListItemFooterProps } from "@/types";

export const ListItemFooter: React.FC<ListItemFooterProps> = ({ sizeKb, filename }) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.ListItemFooter_div_className}>
      <span className="flex items-center gap-1">
        <HardDrive className={TACTICAL_VIEW_STYLES.ListItemFooter_HardDrive_className} />
        {sizeKb} KB
      </span>
      <span className={TACTICAL_VIEW_STYLES.ListItemFooter_span_className}>
        {filename}
      </span>
    </div>
  );
};

export default ListItemFooter;

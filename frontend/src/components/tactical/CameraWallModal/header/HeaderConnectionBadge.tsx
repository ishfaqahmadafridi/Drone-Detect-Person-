"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { HeaderConnectionBadgeProps } from "@/types";

export const HeaderConnectionBadge: React.FC<HeaderConnectionBadgeProps> = ({
  connectedCount,
  totalCount,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.HeaderConnectionBadge_div_className}>
      <span className={TACTICAL_VIEW_STYLES.HeaderConnectionBadge_span_className} />
      <span>
        {connectedCount}/{totalCount} CONNECTED
      </span>
    </div>
  );
};

export default HeaderConnectionBadge;

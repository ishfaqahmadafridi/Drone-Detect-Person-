"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { ViewportSourceBadgeProps } from "@/types";

export const SourceBadge: React.FC<ViewportSourceBadgeProps> = ({ sourceType }) => {
  return (
    <span className={TACTICAL_VIEW_STYLES.SourceBadge_span_className}>
      {sourceType.toUpperCase()}
    </span>
  );
};

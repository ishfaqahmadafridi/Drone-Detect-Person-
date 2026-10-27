"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { PerimeterActionButtonsProps } from "@/types";
import { RefreshCw, LayoutGrid } from "lucide-react";

export const PerimeterActionButtons: React.FC<PerimeterActionButtonsProps> = ({
  onOpenWall,
  onReconnectStream,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 pt-1">
      {/* 1. Reconnect Camera Feed Button */}
      <button
        type="button"
        onClick={() => onReconnectStream?.()}
        className={TACTICAL_VIEW_STYLES.PerimeterActionButtons_button_className}
        title="Reconnect or reset CCTV feed connection"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>RECONNECT FEED</span>
      </button>

      {/* 2. Open Camera Wall Button */}
      <button
        type="button"
        onClick={() => onOpenWall?.()}
        className={TACTICAL_VIEW_STYLES.PerimeterActionButtons_button_className_2}
        title="Open Full Camera Wall Matrix"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span>CAMERA WALL</span>
      </button>
    </div>
  );
};

export default PerimeterActionButtons;

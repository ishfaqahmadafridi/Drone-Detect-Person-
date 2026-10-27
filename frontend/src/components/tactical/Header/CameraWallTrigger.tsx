"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { CameraWallTriggerProps } from "@/types";
import { LayoutGrid } from "lucide-react";

export const CameraWallTrigger: React.FC<CameraWallTriggerProps> = ({ onOpenWall }) => {
  return (
    <button
      onClick={onOpenWall}
      className={TACTICAL_VIEW_STYLES.CameraWallTrigger_button_className}
      title="Open Tactical Multi-Camera Wall"
    >
      <LayoutGrid className={TACTICAL_VIEW_STYLES.GroundStep3Form_Network_className} />
      <span className="hidden sm:inline">CAMERA WALL</span>
    </button>
  );
};

export default CameraWallTrigger;

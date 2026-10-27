"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Eye } from "lucide-react";
import { SidebarCameraWallTriggerProps } from "@/types";

export const SidebarCameraWallTrigger: React.FC<SidebarCameraWallTriggerProps> = ({
  isCollapsed,
  onOpenWall,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.SidebarCameraWallTrigger_div_className}>
      <button
        onClick={onOpenWall}
        className={`${TACTICAL_VIEW_STYLES.SidebarCameraWallTrigger_button_className}${
          isCollapsed ? "justify-center px-0" : ""
        }`}
        title="Launch Tactical Multi-Sensor Camera Wall"
      >
        <Eye className={TACTICAL_VIEW_STYLES.StreamLinkProber_Activity_className} />
        {!isCollapsed && <span>CAMERA WALL</span>}
      </button>
    </div>
  );
};

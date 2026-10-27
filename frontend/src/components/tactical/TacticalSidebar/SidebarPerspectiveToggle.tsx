"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { SidebarPerspectiveToggleProps } from "@/types";
import { Crosshair, Video } from "lucide-react";

export const SidebarPerspectiveToggle: React.FC<SidebarPerspectiveToggleProps> = ({
  viewMode,
  onViewSelect,
  isCollapsed,
}) => {
  if (isCollapsed) {
    return (
      <div className="mt-2.5 flex flex-col items-center gap-1.5 p-1 select-none">
        <button
          onClick={() => onViewSelect("aerial")}
          title="Perspective: Aerial Drone Model"
          aria-label="Perspective: Aerial Drone Model"
          className={`p-2 rounded-lg cursor-pointer transition-all duration-150 active:scale-95 ${
            viewMode === "aerial"
              ? TACTICAL_VIEW_STYLES.SidebarPerspectiveToggle_button_className
              : TACTICAL_VIEW_STYLES.SidebarPerspectiveToggle_button_className_2
          }`}
        >
          <Crosshair className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewSelect("ground")}
          title="Perspective: Ground CCTV Model"
          aria-label="Perspective: Ground CCTV Model"
          className={`p-2 rounded-lg cursor-pointer transition-all duration-150 active:scale-95 ${
            viewMode === "ground"
              ? TACTICAL_VIEW_STYLES.SidebarPerspectiveToggle_button_className
              : TACTICAL_VIEW_STYLES.SidebarPerspectiveToggle_button_className_2
          }`}
        >
          <Video className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="px-3 pt-3 pb-2 select-none">
      <div className={TACTICAL_VIEW_STYLES.SidebarPerspectiveToggle_div_className}>
        PERSPECTIVE
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onViewSelect("aerial")}
          title="Switch to Aerial Drone Perspective (UAV Flight Model)"
          className={`flex items-center justify-center py-2 px-2 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] ${
            viewMode === "aerial"
              ? TACTICAL_VIEW_STYLES.SidebarPerspectiveToggle_button_className_3
              : TACTICAL_VIEW_STYLES.SidebarPerspectiveToggle_button_className_4
          }`}
        >
          <span>Aerial Drone</span>
        </button>

        <button
          onClick={() => onViewSelect("ground")}
          title="Switch to Ground CCTV Perspective (Perimeter Camera Model)"
          className={`flex items-center justify-center py-2 px-2 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] ${
            viewMode === "ground"
              ? TACTICAL_VIEW_STYLES.SidebarPerspectiveToggle_button_className_3
              : TACTICAL_VIEW_STYLES.SidebarPerspectiveToggle_button_className_4
          }`}
        >
          <span>Ground CCTV</span>
        </button>
      </div>
    </div>
  );
};


export default SidebarPerspectiveToggle;

"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { HeaderActionControlsProps } from "@/types";
import { SplitSquareVertical, LayoutGrid, X } from "lucide-react";

export const HeaderActionControls: React.FC<HeaderActionControlsProps> = ({
  onConnectAll,
  onLaunchSplit,
  onClose,
}) => {
  return (
    <>
      {onConnectAll && (
        <button
          type="button"
          onClick={onConnectAll}
          className={TACTICAL_VIEW_STYLES.HeaderActionControls_button_className}
          title="Connect all 5 cameras simultaneously in live stream"
        >
          <span>+ CONNECT ALL (5-UP)</span>
        </button>
      )}

      {onLaunchSplit && (
        <>
          <button
            type="button"
            onClick={() => onLaunchSplit("dual")}
            className={TACTICAL_VIEW_STYLES.HeaderActionControls_button_className_2}
            title="View Drone Aerial & Ground CCTV live at the same time"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>DUAL (2-UP)</span>
          </button>

          <button
            type="button"
            onClick={() => onLaunchSplit("quad")}
            className={TACTICAL_VIEW_STYLES.HeaderActionControls_button_className_2}
            title="View 4 Cameras live at the same time in 2x2 matrix"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>QUAD (4-UP)</span>
          </button>
        </>
      )}

      <button
        onClick={onClose}
        className={TACTICAL_VIEW_STYLES.HeaderActionControls_button_className_3}
        title="Close Camera Wall"
        aria-label="Close Camera Wall Modal"
      >
        <X className="w-5 h-5" />
      </button>
    </>
  );
};

export default HeaderActionControls;

"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { DeviceDeckActionsProps } from "@/types";

export const DeviceDeckActions: React.FC<DeviceDeckActionsProps> = ({
  isCommandPending,
  onCommand,
  viewMode = "aerial",
}) => {
  if (viewMode !== "ground") return null;

  return (
    <div className="select-none">
      <div className={TACTICAL_VIEW_STYLES.DeviceDeckActions_div_className}>
        Simulated perimeter controls
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onCommand("preset_gate")}
          disabled={isCommandPending}
          className={TACTICAL_VIEW_STYLES.DeviceDeckActions_button_className}
        >
          Lock Gate
        </button>
        <button
          onClick={() => onCommand("preset_patrol")}
          disabled={isCommandPending}
          className={TACTICAL_VIEW_STYLES.DeviceDeckActions_button_className_2}
        >
          Patrol 360
        </button>
        <button
          onClick={() => onCommand("ir_filter")}
          disabled={isCommandPending}
          className={TACTICAL_VIEW_STYLES.DeviceDeckActions_button_className}
        >
          IR Filter
        </button>
        <button
          onClick={() => onCommand("reboot_sensor")}
          disabled={isCommandPending}
          className={TACTICAL_VIEW_STYLES.DeviceDeckActions_button_className_3}
        >
          Reset PTZ
        </button>
      </div>

    </div>
  );
};

export default DeviceDeckActions;

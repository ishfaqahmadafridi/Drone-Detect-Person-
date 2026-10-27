"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { DeviceDeckActionsProps } from "@/types";

export const DeviceDeckActions: React.FC<DeviceDeckActionsProps> = ({
  flightState,
  isCommandPending,
  onCommand,
  viewMode = "aerial",
}) => {
  const isGround = viewMode === "ground";

  return (
    <div className="select-none">
      <div className={TACTICAL_VIEW_STYLES.DeviceDeckActions_div_className}>
        {isGround ? "Perimeter controls" : "Flight control"}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {isGround ? (
          <>
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
          </>
        ) : (
          <>
            <button
              onClick={() => onCommand("takeoff")}
              disabled={isCommandPending}
              className={`py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                flightState === "AIRBORNE"
                  ? TACTICAL_VIEW_STYLES.DeviceDeckActions_button_className_4
                  : TACTICAL_VIEW_STYLES.DeviceDeckActions_button_className_5
              }`}
            >
              Takeoff
            </button>
            <button
              onClick={() => onCommand("patrol")}
              disabled={isCommandPending}
              className={`py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                flightState === "PATROL"
                  ? TACTICAL_VIEW_STYLES.DeviceDeckActions_button_className_6
                  : TACTICAL_VIEW_STYLES.DeviceDeckActions_button_className_7
              }`}
            >
              Patrol
            </button>
            <button
              onClick={() => onCommand("rtl")}
              disabled={isCommandPending}
              className={`py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                flightState === "RTL"
                  ? TACTICAL_VIEW_STYLES.DeviceDeckActions_button_className_8
                  : TACTICAL_VIEW_STYLES.DeviceDeckActions_button_className_5
              }`}
            >
              RTL
            </button>
            <button
              onClick={() => onCommand("land")}
              disabled={isCommandPending}
              className={`py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                flightState === "LAND"
                  ? TACTICAL_VIEW_STYLES.DeviceDeckActions_button_className_9
                  : TACTICAL_VIEW_STYLES.DeviceDeckActions_button_className_10
              }`}
            >
              Land
            </button>
          </>
        )}
      </div>

      <p className={TACTICAL_VIEW_STYLES.DeviceDeckActions_p_className}>
        Flight commands change simulated state only.
      </p>
    </div>
  );
};

export default DeviceDeckActions;

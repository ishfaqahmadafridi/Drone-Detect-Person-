"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { SidebarHeaderProps } from "@/types";
import { Shield, ChevronLeft, ChevronRight, Radio, Camera } from "lucide-react";

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
  flightState,
  isAirborne,
  viewMode = "aerial",
}) => {
  const isGround = viewMode === "ground";
  return (
    <div className={TACTICAL_VIEW_STYLES.SidebarHeader_div_className}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className={TACTICAL_VIEW_STYLES.SidebarHeader_div_className_2}>
            <Shield className={TACTICAL_VIEW_STYLES.SidebarHeader_Shield_className} />
            <div className={TACTICAL_VIEW_STYLES.SidebarHeader_div_className_3} />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className={TACTICAL_VIEW_STYLES.SidebarHeader_span_className}>
                AERO-GUARD
              </span>
              <span className={TACTICAL_VIEW_STYLES.SidebarHeader_span_className_2}>
                <span className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_span_className_2} />
                DEFENSE HUD v2.5
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className={TACTICAL_VIEW_STYLES.SidebarHeader_button_className}
          title={isCollapsed ? "Expand Tactical Sidebar" : "Collapse Sidebar"}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Tactical Airspace / Perimeter Status Banner */}
      {!isCollapsed && (
        <div className={TACTICAL_VIEW_STYLES.SidebarHeader_div_className_4}>
          <span className={TACTICAL_VIEW_STYLES.SidebarHeader_span_className_3}>
            {isGround ? (
              <>
                <Camera className={TACTICAL_VIEW_STYLES.SidebarHeader_Camera_className} />
                CAM LINK:
              </>
            ) : (
              <>
                <Radio className={TACTICAL_VIEW_STYLES.SidebarHeader_Radio_className} />
                UAV LINK:
              </>
            )}
          </span>
          <span
            className={`font-bold px-1.5 py-0.5 rounded text-[10px] uppercase ${
              isGround
                ? TACTICAL_VIEW_STYLES.SidebarHeader_span_className_4
                : isAirborne
                ? TACTICAL_VIEW_STYLES.SidebarHeader_span_className_4
                : TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_div_className_5
            }`}
          >
            {isGround ? "ONLINE" : flightState}
          </span>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;

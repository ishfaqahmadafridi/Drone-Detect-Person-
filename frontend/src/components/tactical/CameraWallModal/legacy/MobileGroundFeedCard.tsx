"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { MobileGroundFeedCardProps } from "@/types";
import { Plus } from "lucide-react";
import { MobileGroundCardHeader } from "./MobileGroundCardHeader";
import { GroundActiveStreamState } from "./GroundActiveStreamState";
import { GroundSensorModal } from "../wizard/GroundSensorModal";
import { useMobileGroundFeed } from "@/hooks";

export const MobileGroundFeedCard: React.FC<MobileGroundFeedCardProps> = ({
  isActive,
  onConnectRtsp,
  onSelectFeed,
}) => {
  const {
    isModalOpen,
    setIsModalOpen,
    handleConnect,
    handlePromote,
  } = useMobileGroundFeed({ onConnectRtsp, onSelectFeed });

  return (
    <>
      <div
        className={`group relative rounded-xl border overflow-hidden transition-all duration-300 flex flex-col justify-between ${
          isActive
            ? TACTICAL_VIEW_STYLES.MobileGroundFeedCard_div_className
            : TACTICAL_VIEW_STYLES.MobileGroundFeedCard_div_className_2
        }`}
      >
        {/* 1. Tactical Channel Header */}
        <MobileGroundCardHeader isActive={isActive} />

        {/* 2. Card Body: Active Stream Status vs Clean Standby with '+' Connect Action */}
        <div className={TACTICAL_VIEW_STYLES.MobileGroundFeedCard_div_className_3}>
          {isActive ? (
            <GroundActiveStreamState
              onPromote={handlePromote}
              onReconfigure={() => setIsModalOpen(true)}
            />
          ) : (
            /* Show ONLY '+' to add or connect new sensor */
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={TACTICAL_VIEW_STYLES.MobileGroundFeedCard_button_className}
            >
              <div className={TACTICAL_VIEW_STYLES.MobileGroundFeedCard_div_className_4}>
                <Plus className="w-7 h-7 group-hover/add:scale-125 transition-transform" />
                <span className={TACTICAL_VIEW_STYLES.MobileGroundFeedCard_span_className} />
              </div>

              <span className={TACTICAL_VIEW_STYLES.MobileGroundFeedCard_span_className_2}>
                CONNECT NEW SENSOR
              </span>
              <span className={TACTICAL_VIEW_STYLES.AddSensorCard_span_className_2}>
                Click to configure Wall CCTV or Smartphone
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Standalone Guided Sensor Connection Dialog */}
      <GroundSensorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={handleConnect}
      />
    </>
  );
};

export default MobileGroundFeedCard;

"use client";

import React from "react";
import { CameraWallModalProps } from "@/types";
import { CameraWallHeader } from "./CameraWallHeader";
import { AerialFeedCard } from "./AerialFeedCard";
import { MobileGroundFeedCard } from "./MobileGroundFeedCard";

export const CameraWallModal: React.FC<CameraWallModalProps> = ({
  isOpen,
  activeSource,
  onClose,
  onSelectFeed,
  onConnectRtsp,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative glass-panel-elevated max-w-4xl w-full rounded-2xl overflow-hidden border border-cyan-500/30 flex flex-col max-h-[90vh] shadow-[0_0_40px_rgba(6,182,212,0.2)]">
        {/* 1. Modal Tactical Header */}
        <CameraWallHeader onClose={onClose} />

        {/* 2. Dual Perspective Tactical Matrix Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto">
          {/* Channel 01: Aerial Drone Primary Gimbal */}
          <AerialFeedCard
            isActive={activeSource === "synthetic"}
            onSelect={() => onSelectFeed("synthetic", "aerial")}
          />

          {/* Channel 02: Ground CCTV & Mobile Sensors */}
          <MobileGroundFeedCard
            isActive={activeSource === "rtsp"}
            onConnectRtsp={onConnectRtsp}
            onSelectFeed={onSelectFeed}
          />
        </div>
      </div>
    </div>
  );
};

export default CameraWallModal;
export * from "./CameraWallHeader";
export * from "./AerialFeedCard";
export * from "./MobileGroundFeedCard";
export * from "./MobileGroundCardHeader";
export * from "./GroundActiveStreamState";
export * from "./MobilePixelQuickConnect";
export * from "./MobileCustomStreamForm";
export * from "./wizard/GroundSensorWizard";
export * from "./wizard/GroundSensorModal";

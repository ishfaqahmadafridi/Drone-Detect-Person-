"use client";

import React from "react";
import { CameraWallModalProps } from "@/types";
import { CameraWallHeader } from "./CameraWallHeader";
import { AerialFeedCard } from "./AerialFeedCard";
import { MobileGroundFeedCard } from "./MobileGroundFeedCard";
import { ThermalFeedCard } from "./ThermalFeedCard";
import { SatelliteFeedCard } from "./SatelliteFeedCard";

export const CameraWallModal: React.FC<CameraWallModalProps> = ({
  isOpen,
  activeSource,
  onClose,
  onSelectFeed,
  onConnectRtsp,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative glass-panel-elevated max-w-5xl w-full rounded-2xl overflow-hidden border border-cyan-500/30 flex flex-col max-h-[90vh]">
        {/* 1. Modal Tactical Header */}
        <CameraWallHeader onClose={onClose} />

        {/* 2. 4-Channel Tactical Matrix Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
          {/* Channel 01: Aerial Drone Primary Gimbal */}
          <AerialFeedCard
            isActive={activeSource === "synthetic"}
            onSelect={() => onSelectFeed("synthetic", "aerial")}
          />

          {/* Channel 02: Mobile Phone / Ground CCTV / Local Webcam */}
          <MobileGroundFeedCard
            isActive={activeSource === "webcam" || activeSource === "rtsp"}
            onSelectWebcam={() => onSelectFeed("webcam", "ground")}
            onConnectRtsp={onConnectRtsp}
          />

          {/* Channel 03: FLIR Long-Wave IR Thermal Recon */}
          <ThermalFeedCard
            isActive={false}
            onSelect={() => onSelectFeed("synthetic", "aerial")}
          />

          {/* Channel 04: Low Earth Orbit Satellite Perimeter Radar */}
          <SatelliteFeedCard
            isActive={false}
            onSelect={() => onSelectFeed("synthetic", "aerial")}
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
export * from "./MobilePixelQuickConnect";
export * from "./MobileHardwareWebcamButton";
export * from "./MobileCustomStreamForm";
export * from "./ThermalFeedCard";
export * from "./SatelliteFeedCard";

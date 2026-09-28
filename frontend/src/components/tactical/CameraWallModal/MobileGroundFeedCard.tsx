"use client";

import React from "react";
import { MobileGroundFeedCardProps } from "@/types";
import { Camera } from "lucide-react";
import { MobileGroundCardHeader } from "./MobileGroundCardHeader";
import { MobilePixelQuickConnect } from "./MobilePixelQuickConnect";
import { MobileHardwareWebcamButton } from "./MobileHardwareWebcamButton";
import { MobileCustomStreamForm } from "./MobileCustomStreamForm";

export const MobileGroundFeedCard: React.FC<MobileGroundFeedCardProps> = ({
  isActive,
  onSelectWebcam,
  onConnectRtsp,
}) => {
  return (
    <div
      className={`group relative rounded-xl border overflow-hidden transition-all duration-300 ${
        isActive
          ? "border-emerald-400 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
          : "border-slate-800 bg-slate-950/40 hover:border-emerald-500/50"
      }`}
    >
      {/* Channel Header */}
      <MobileGroundCardHeader isActive={isActive} />

      <div className="relative p-4 flex flex-col items-center justify-center text-center bg-[#040814]/90 gap-2.5">
        <Camera className="w-9 h-9 text-emerald-400/60 group-hover:scale-110 transition-transform" />
        <div>
          <span className="font-display font-semibold text-xs text-slate-200 block">
            Ground Sensor / Mobile Phone Uplink
          </span>
          <span className="font-mono-code text-[10px] text-slate-400 block mt-0.5">
            Mac Continuity Camera, USB webcam, or Wi-Fi IP phone stream
          </span>
        </div>

        {/* 1. One-Click Quick Connect: Google Pixel 6a */}
        <MobilePixelQuickConnect onConnectRtsp={onConnectRtsp} />

        {/* 2. Direct Hardware Webcam / Mac Continuity iPhone */}
        <MobileHardwareWebcamButton onSelectWebcam={onSelectWebcam} />

        {/* 3. Mobile Phone IP Stream (IP Webcam / DroidCam / RTSP) */}
        <MobileCustomStreamForm onConnectRtsp={onConnectRtsp} />
      </div>
    </div>
  );
};

export default MobileGroundFeedCard;

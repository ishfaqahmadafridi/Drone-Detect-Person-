"use client";

import React, { useState } from "react";
import { MobileGroundFeedCardProps } from "@/types";
import { Plus } from "lucide-react";
import { MobileGroundCardHeader } from "./MobileGroundCardHeader";
import { GroundActiveStreamState } from "./GroundActiveStreamState";
import { GroundSensorModal } from "./wizard/GroundSensorModal";

export const MobileGroundFeedCard: React.FC<MobileGroundFeedCardProps> = ({
  isActive,
  onConnectRtsp,
  onSelectFeed,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleConnect = (url: string) => {
    setIsModalOpen(false);
    if (onConnectRtsp) {
      onConnectRtsp(url);
    }
  };

  const handlePromote = () => {
    if (onSelectFeed) {
      onSelectFeed("rtsp", "ground");
    }
  };

  return (
    <>
      <div
        className={`group relative rounded-xl border overflow-hidden transition-all duration-300 flex flex-col justify-between ${
          isActive
            ? "border-emerald-400 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
            : "border-slate-700/60 bg-slate-950/40 hover:border-emerald-500/50"
        }`}
      >
        {/* 1. Tactical Channel Header */}
        <MobileGroundCardHeader isActive={isActive} />

        {/* 2. Card Body: Active Stream Status vs Clean Standby with '+' Connect Action */}
        <div className="relative p-6 flex flex-col items-center bg-[#040814]/95 gap-3.5 flex-1 justify-center min-h-[260px]">
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
              className="group/add relative flex flex-col items-center justify-center p-6 w-full max-w-xs rounded-2xl bg-[#06080E]/70 hover:bg-emerald-950/30 border border-dashed border-slate-700/80 hover:border-emerald-400 transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]"
            >
              <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 group-hover/add:border-emerald-400 group-hover/add:bg-emerald-500/20 text-emerald-400 transition-all mb-3">
                <Plus className="w-7 h-7 group-hover/add:scale-125 transition-transform" />
                <span className="absolute inset-0 rounded-full border border-emerald-400/40 animate-ping group-hover/add:animate-none opacity-40" />
              </div>

              <span className="font-display font-black text-xs uppercase tracking-wider text-white group-hover/add:text-emerald-300 transition-colors">
                CONNECT NEW SENSOR
              </span>
              <span className="font-mono-code text-[10px] text-slate-400 mt-1 text-center">
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

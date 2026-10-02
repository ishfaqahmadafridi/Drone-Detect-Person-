"use client";

import React from "react";
import { GroundStep1DeviceProps } from "@/types";
import { Video, Smartphone, ArrowRight, ShieldCheck } from "lucide-react";

export const GroundStep1Device: React.FC<GroundStep1DeviceProps> = ({
  selectedDevice,
  onSelectDevice,
  onNext,
}) => {
  return (
    <div className="flex flex-col gap-3.5 text-left animate-in fade-in duration-200">
      <div className="flex flex-col gap-0.5">
        <span className="font-display font-bold text-xs uppercase tracking-wider text-white">
          STEP 1: SELECT SENSOR CATEGORY
        </span>
        <span className="font-mono-code text-[10px] text-slate-400">
          Choose the physical hardware profile to connect and configure
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Option 1: Wall CCTV Camera */}
        <button
          type="button"
          onClick={() => onSelectDevice("wall_cctv")}
          className={`p-3.5 rounded-xl border flex flex-col justify-between text-left cursor-pointer transition-all duration-150 active:scale-[0.99] ${
            selectedDevice === "wall_cctv"
              ? "border-blue-500/70 bg-blue-600/15 shadow-[0_0_16px_rgba(59,130,246,0.2)] ring-1 ring-blue-500/40"
              : "border-slate-800 bg-[#0A0D14]/60 hover:border-slate-700 hover:bg-slate-900/60"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`p-2 rounded-lg ${
                selectedDevice === "wall_cctv"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/40"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              <Video className="w-5 h-5" />
            </div>
            {selectedDevice === "wall_cctv" && (
              <span className="flex items-center gap-1 text-[10px] font-mono-code font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/40">
                <ShieldCheck className="w-3 h-3 text-blue-400" /> SELECTED
              </span>
            )}
          </div>

          <div>
            <span className="font-display font-bold text-xs text-white block">
              WALL CCTV CAMERA
            </span>
            <span className="font-mono-code text-[10px] text-slate-400 block mt-1 leading-relaxed">
              Fixed perimeter security dome / bullet optical sensor with PoE or Wi-Fi RTSP feed.
            </span>
          </div>
        </button>

        {/* Option 2: Mobile Phone */}
        <button
          type="button"
          onClick={() => onSelectDevice("mobile_phone")}
          className={`p-3.5 rounded-xl border flex flex-col justify-between text-left cursor-pointer transition-all duration-150 active:scale-[0.99] ${
            selectedDevice === "mobile_phone"
              ? "border-blue-500/70 bg-blue-600/15 shadow-[0_0_16px_rgba(59,130,246,0.2)] ring-1 ring-blue-500/40"
              : "border-slate-800 bg-[#0A0D14]/60 hover:border-slate-700 hover:bg-slate-900/60"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`p-2 rounded-lg ${
                selectedDevice === "mobile_phone"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/40"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              <Smartphone className="w-5 h-5" />
            </div>
            {selectedDevice === "mobile_phone" && (
              <span className="flex items-center gap-1 text-[10px] font-mono-code font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/40">
                <ShieldCheck className="w-3 h-3 text-blue-400" /> SELECTED
              </span>
            )}
          </div>

          <div>
            <span className="font-display font-bold text-xs text-white block">
              MOBILE PHONE / SMARTPHONE
            </span>
            <span className="font-mono-code text-[10px] text-slate-400 block mt-1 leading-relaxed">
              Field patrol handheld camera streaming over local Wi-Fi or RTSP / IP Webcam app.
            </span>
          </div>
        </button>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={onNext}
          className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white border border-blue-500/60 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all duration-150 active:scale-[0.98] shadow-sm"
        >
          <span>NEXT: CHOOSE UPLINK</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default GroundStep1Device;

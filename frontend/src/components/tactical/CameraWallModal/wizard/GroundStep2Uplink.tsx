"use client";

import React from "react";
import { GroundStep2UplinkProps } from "@/types";
import { Zap, Wifi, ArrowLeft, ArrowRight, ShieldCheck, Cable, Radio } from "lucide-react";

export const GroundStep2Uplink: React.FC<GroundStep2UplinkProps> = ({
  deviceCategory,
  connectionType,
  wiredSubtype,
  wirelessSubtype,
  onChangeConnectionType,
  onChangeWiredSubtype,
  onChangeWirelessSubtype,
  onBack,
  onNext,
}) => {
  const isWall = deviceCategory === "wall_cctv";

  return (
    <div className="flex flex-col gap-3.5 text-left animate-in fade-in duration-200">
      <div className="flex flex-col gap-0.5">
        <span className="font-display font-bold text-xs uppercase tracking-wider text-white">
          STEP 2: CHOOSE CONNECTION ARCHITECTURE
        </span>
        <span className="font-mono-code text-[10px] text-slate-400">
          Select physical data transmission medium and protocol profile
        </span>
      </div>

      {isWall ? (
        <div className="flex flex-col gap-3">
          {/* Main Toggle: Wired Cable vs Wireless Wi-Fi */}
          <div className="grid grid-cols-2 gap-3">
            {/* Wired Mode */}
            <button
              type="button"
              onClick={() => onChangeConnectionType("wired")}
              className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all ${
                connectionType === "wired"
                  ? "border-emerald-400 bg-emerald-950/30 shadow-[0_0_16px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/50"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    connectionType === "wired"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <Zap className="w-5 h-5" />
                </div>
                {connectionType === "wired" && (
                  <span className="flex items-center gap-1 text-[10px] font-mono-code font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" /> ACTIVE
                  </span>
                )}
              </div>

              <div>
                <span className="font-display font-bold text-xs text-white block">
                  WIRED CONNECTION
                </span>
                <span className="font-mono-code text-[10px] text-slate-400 block mt-0.5">
                  PoE+ 48V (CAT6 Ethernet Cable) or Direct Hardware USB
                </span>
              </div>
            </button>

            {/* Wireless Mode */}
            <button
              type="button"
              onClick={() => onChangeConnectionType("wireless")}
              className={`p-3.5 rounded-xl border flex flex-col justify-between text-left cursor-pointer transition-all duration-150 active:scale-[0.99] ${
                connectionType === "wireless"
                  ? "border-blue-500/70 bg-blue-600/15 shadow-[0_0_16px_rgba(59,130,246,0.2)] ring-1 ring-blue-500/40"
                  : "border-slate-800 bg-[#0A0D14]/60 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    connectionType === "wireless"
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/40"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <Wifi className="w-5 h-5" />
                </div>
                {connectionType === "wireless" && (
                  <span className="flex items-center gap-1 text-[10px] font-mono-code font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/40">
                    <ShieldCheck className="w-3 h-3 text-blue-400" /> ACTIVE
                  </span>
                )}
              </div>

              <div>
                <span className="font-display font-bold text-xs text-white block">
                  WIRELESS CONNECTION
                </span>
                <span className="font-mono-code text-[10px] text-slate-400 block mt-0.5">
                  802.11ac 5GHz Wi-Fi / Secure CCTV Access Point
                </span>
              </div>
            </button>
          </div>

          {/* Subtype Selection */}
          <div className="p-3 rounded-xl bg-[#0A0D14] border border-slate-700/60 flex flex-col gap-2">
            <span className="font-mono-code text-[10px] text-slate-400">
              INTERFACE SPECIFICATION:
            </span>

            {connectionType === "wired" ? (
              <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
                <button
                  type="button"
                  onClick={() => onChangeWiredSubtype("poe_rtsp")}
                  className={`p-2.5 rounded-lg border text-left flex items-start gap-2 cursor-pointer transition-all duration-150 active:scale-[0.98] ${
                    wiredSubtype === "poe_rtsp"
                      ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)] font-semibold"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <Cable className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="font-bold text-white">PoE Ethernet LAN (RTSP)</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">
                      Standard security dome/bullet connected via switch or NVR port
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeWiredSubtype("usb_direct")}
                  className={`p-2.5 rounded-lg border text-left flex items-start gap-2 cursor-pointer transition-all duration-150 active:scale-[0.98] ${
                    wiredSubtype === "usb_direct"
                      ? "border-blue-500/60 bg-blue-500/20 text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.15)] font-semibold"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <Zap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="font-bold text-white">Direct USB / HDMI Capture</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">
                      Local hardware capture card or USB V4L2 device index
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
                <button
                  type="button"
                  onClick={() => onChangeWirelessSubtype("wifi_rtsp")}
                  className={`p-2.5 rounded-lg border text-left flex items-start gap-2 cursor-pointer transition-all duration-150 active:scale-[0.98] ${
                    wirelessSubtype === "wifi_rtsp"
                      ? "border-blue-500/60 bg-blue-500/20 text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.15)] font-semibold"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <Wifi className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="font-bold text-white">Facility Wi-Fi (IP/RTSP)</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">
                      Camera connected to facility LAN / router subnet
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeWirelessSubtype("ap_direct")}
                  className={`p-2.5 rounded-lg border text-left flex items-start gap-2 cursor-pointer transition-all duration-150 active:scale-[0.98] ${
                    wirelessSubtype === "ap_direct"
                      ? "border-blue-500/60 bg-blue-500/20 text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.15)] font-semibold"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <Radio className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="font-bold text-white">Direct Camera AP Link</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">
                      Direct point-to-point Wi-Fi link to camera hotspot
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Mobile Phone Uplink Protocols */
        <div className="p-4 rounded-xl bg-[#0A0D14] border border-slate-700/60 flex flex-col gap-2.5">
          <span className="font-mono-code text-[11px] text-blue-400 font-bold">
            MOBILE TRANSMISSION PROTOCOL:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
            <div className="p-3 rounded-lg border border-blue-500/50 bg-blue-500/15 text-blue-200">
              <span className="font-bold block">Android IP Webcam (HTTP/MJPEG)</span>
              <span className="text-[9px] text-slate-400 block mt-1">
                Port 8080 stream. Supported on Google Pixel, Samsung, and Android devices.
              </span>
            </div>
            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400">
              <span className="font-bold text-white block">iOS Live-Reporter (RTSP)</span>
              <span className="text-[9px] text-slate-400 block mt-1">
                Standard H.264 RTSP broadcast stream from Apple iOS devices.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onBack}
          className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-display text-xs font-semibold uppercase flex items-center gap-1.5 cursor-pointer transition-all duration-150 active:scale-95 border border-slate-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white border border-blue-500/60 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all duration-150 active:scale-[0.98] shadow-sm"
        >
          <span>NEXT: CONFIGURE PARAMETERS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default GroundStep2Uplink;

"use client";

import React from "react";
import { GroundStep3FormProps } from "@/types";
import { ArrowLeft, ArrowRight, Bookmark, Lock, Network, AlertTriangle, CheckCircle2 } from "lucide-react";

export const GroundStep3Form: React.FC<GroundStep3FormProps> = ({
  config,
  onChangeField,
  onApplyPreset,
  onBack,
  onNext,
}) => {
  const isWall = config.deviceCategory === "wall_cctv";
  const isWired = config.connectionType === "wired";
  const isUsb = isWired && config.wiredSubtype === "usb_direct";

  // Strict Validation Rules for Camera Uplink Parameters
  const isHostValid = Boolean(config.host && config.host.trim().length > 0);
  const isPortValid = Boolean(
    config.port && !isNaN(Number(config.port)) && Number(config.port) >= 1 && Number(config.port) <= 65535
  );
  const isStreamPathValid = Boolean(config.streamPath && config.streamPath.trim().length > 0);
  const isUsbValid = Boolean(!isUsb || (config.usbDeviceIndex && config.usbDeviceIndex.trim().length > 0));

  const isFormValid = isUsb ? isUsbValid : isHostValid && isPortValid && isStreamPathValid;

  const handleNextClick = () => {
    if (!isFormValid) return;
    onNext();
  };

  return (
    <div className="flex flex-col gap-3.5 text-left animate-in fade-in duration-200">
      <div className="flex flex-col gap-0.5">
        <span className="font-display font-bold text-xs uppercase tracking-wider text-white">
          STEP 3: NETWORK & HARDWARE PARAMETERS
        </span>
        <span className="font-mono-code text-[10px] text-slate-400">
          Enter host IP, RTSP port, credentials, and transport options
        </span>
      </div>

      {/* 1. Quick Tactical Presets */}
      <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
        <span className="font-mono-code text-[10px] text-slate-400 flex items-center gap-1">
          <Bookmark className="w-3 h-3 text-cyan-400" />
          QUICK CHANNEL PRESETS:
        </span>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono-code">
          {isWall ? (
            isWired ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    onApplyPreset({
                      host: "192.168.1.100",
                      port: 554,
                      streamPath: "/live",
                      username: "admin",
                      password: "",
                      transportProtocol: "tcp",
                    })
                  }
                  className="p-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 text-left transition-colors"
                >
                  <span className="font-bold block">PORT 01: CAM-01 (Main Wall)</span>
                  <span className="text-[9px] text-slate-400 block truncate">192.168.1.100:554/live</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onApplyPreset({
                      host: "192.168.1.101",
                      port: 554,
                      streamPath: "/ch1",
                      username: "admin",
                      password: "",
                      transportProtocol: "tcp",
                    })
                  }
                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-800 text-left transition-colors"
                >
                  <span className="font-bold block">PORT 02: CAM-02 (Perimeter North)</span>
                  <span className="text-[9px] text-slate-400 block truncate">192.168.1.101:554/ch1</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() =>
                    onApplyPreset({
                      host: "192.168.1.150",
                      port: 8554,
                      streamPath: "/live",
                      username: "admin",
                      password: "",
                      transportProtocol: "tcp",
                    })
                  }
                  className="p-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-950/40 text-left transition-colors"
                >
                  <span className="font-bold block">Wi-Fi CAM-01 (Gate West)</span>
                  <span className="text-[9px] text-slate-400 block truncate">192.168.1.150:8554/live</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onApplyPreset({
                      host: "192.168.1.151",
                      port: 8554,
                      streamPath: "/live",
                      username: "admin",
                      password: "",
                      transportProtocol: "tcp",
                    })
                  }
                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-800 text-left transition-colors"
                >
                  <span className="font-bold block">Wi-Fi CAM-02 (South Guard)</span>
                  <span className="text-[9px] text-slate-400 block truncate">192.168.1.151:8554/live</span>
                </button>
              </>
            )
          ) : (
            <>
              <button
                type="button"
                onClick={() =>
                  onApplyPreset({
                    host: "10.10.20.117",
                    port: 8080,
                    streamPath: "/video",
                    username: "",
                    password: "",
                  })
                }
                className="p-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-950/40 text-left transition-colors col-span-2"
              >
                <span className="font-bold block">📱 GOOGLE PIXEL 6A (10.10.20.117:8080)</span>
                <span className="text-[9px] text-slate-400 block">Default Android IP Webcam Wi-Fi stream</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. Structured Parameters Form */}
      {isUsb ? (
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
          <label className="flex flex-col gap-1 text-[11px] font-mono-code text-slate-300">
            <span className="flex items-center gap-1">
              <span>USB HARDWARE DEVICE INDEX / DEV PATH:</span>
              <span className="text-rose-400 font-bold">*</span>
            </span>
            <input
              type="text"
              value={config.usbDeviceIndex}
              onChange={(e) => onChangeField("usbDeviceIndex", e.target.value)}
              placeholder="0, 1, or /dev/video0"
              className={`bg-slate-900 border text-white px-2.5 py-1.5 rounded-lg text-xs font-mono-code outline-none transition-colors ${
                !isUsbValid ? "border-rose-500/80 bg-rose-950/20" : "border-slate-700 focus:border-cyan-400"
              }`}
            />
            {!isUsbValid && (
              <span className="text-[9px] text-rose-400 font-mono-code">
                * Required: Enter valid USB video device index
              </span>
            )}
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] font-mono-code">
          {/* Host / IP */}
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Network className="w-3 h-3 text-cyan-400" />
                <span>CAMERA HOST / IP ADDRESS:</span>
                <span className="text-rose-400 font-bold">*</span>
              </span>
              {!isHostValid && (
                <span className="text-[9px] text-rose-400 font-normal">REQUIRED</span>
              )}
            </span>
            <input
              type="text"
              value={config.host}
              onChange={(e) => onChangeField("host", e.target.value)}
              placeholder={isWall ? "192.168.1.100" : "10.10.20.117"}
              className={`bg-slate-900 border text-white px-2.5 py-1.5 rounded-lg text-xs font-mono-code outline-none transition-colors ${
                !isHostValid
                  ? "border-rose-500/80 bg-rose-950/20 focus:border-rose-400"
                  : "border-slate-700 focus:border-cyan-400"
              }`}
            />
            {!isHostValid && (
              <span className="text-[9px] text-rose-400 font-mono-code">
                * Enter camera IP address or hostname
              </span>
            )}
          </label>

          {/* Port */}
          <label className="flex flex-col gap-1">
            <span className="text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span>PORT:</span>
                <span className="text-rose-400 font-bold">*</span>
              </span>
              {!isPortValid && (
                <span className="text-[9px] text-rose-400 font-normal">INVALID</span>
              )}
            </span>
            <input
              type="number"
              min={1}
              max={65535}
              value={config.port}
              onChange={(e) => onChangeField("port", e.target.value === "" ? 0 : Number(e.target.value))}
              placeholder={isWall ? "554" : "8080"}
              className={`bg-slate-900 border text-white px-2.5 py-1.5 rounded-lg text-xs font-mono-code outline-none transition-colors ${
                !isPortValid
                  ? "border-rose-500/80 bg-rose-950/20 focus:border-rose-400"
                  : "border-slate-700 focus:border-cyan-400"
              }`}
            />
            {!isPortValid && (
              <span className="text-[9px] text-rose-400 font-mono-code">
                * Valid port (1-65535)
              </span>
            )}
          </label>

          {/* Stream Path */}
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span>STREAM PATH (URI):</span>
                <span className="text-rose-400 font-bold">*</span>
              </span>
              {!isStreamPathValid && (
                <span className="text-[9px] text-rose-400 font-normal">REQUIRED</span>
              )}
            </span>
            <input
              type="text"
              value={config.streamPath}
              onChange={(e) => onChangeField("streamPath", e.target.value)}
              placeholder={isWall ? "/live" : "/video"}
              className={`bg-slate-900 border text-white px-2.5 py-1.5 rounded-lg text-xs font-mono-code outline-none transition-colors ${
                !isStreamPathValid
                  ? "border-rose-500/80 bg-rose-950/20 focus:border-rose-400"
                  : "border-slate-700 focus:border-cyan-400"
              }`}
            />
            {!isStreamPathValid && (
              <span className="text-[9px] text-rose-400 font-mono-code">
                * Required stream endpoint (e.g. /live or /video)
              </span>
            )}
          </label>

          {/* Transport Protocol */}
          <label className="flex flex-col gap-1">
            <span className="text-slate-300">TRANSPORT:</span>
            <select
              value={config.transportProtocol}
              onChange={(e) => onChangeField("transportProtocol", e.target.value as "tcp" | "udp")}
              className="bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white px-2 py-1.5 rounded-lg text-xs font-mono-code outline-none cursor-pointer"
            >
              <option value="tcp">TCP (Reliable)</option>
              <option value="udp">UDP (Low Latency)</option>
            </select>
          </label>

          {/* Credentials */}
          <label className="flex flex-col gap-1">
            <span className="text-slate-300 flex items-center gap-1">
              <Lock className="w-3 h-3 text-cyan-400" /> USERNAME:
            </span>
            <input
              type="text"
              value={config.username}
              onChange={(e) => onChangeField("username", e.target.value)}
              placeholder="admin"
              className="bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white px-2.5 py-1.5 rounded-lg text-xs font-mono-code outline-none"
            />
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-slate-300">PASSWORD (OPTIONAL):</span>
            <input
              type="password"
              value={config.password}
              onChange={(e) => onChangeField("password", e.target.value)}
              placeholder="••••••••"
              className="bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white px-2.5 py-1.5 rounded-lg text-xs font-mono-code outline-none"
            />
          </label>
        </div>
      )}

      {/* Real-time Validation Banner */}
      {!isFormValid ? (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono-code text-[10px] animate-in fade-in duration-150">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            CONNECTION PARAMETERS INCOMPLETE: Provide valid Camera Host IP and Port to proceed.
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 px-1 font-mono-code text-[10px] text-emerald-400 animate-in fade-in duration-150">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Parameters validated • Ready to test socket reachability</span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onBack}
          className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-display text-xs font-semibold uppercase flex items-center gap-1.5 transition-colors border border-slate-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK</span>
        </button>

        <button
          type="button"
          onClick={handleNextClick}
          disabled={!isFormValid}
          className={`py-2 px-4 rounded-lg font-display text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
            isFormValid
              ? "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,242,254,0.2)] cursor-pointer"
              : "opacity-40 cursor-not-allowed border border-slate-700 bg-slate-800 text-slate-500 shadow-none pointer-events-none"
          }`}
        >
          <span>NEXT: REVIEW & TEST</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default GroundStep3Form;

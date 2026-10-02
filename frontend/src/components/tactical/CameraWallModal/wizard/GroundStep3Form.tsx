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
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#0A0D14] border border-slate-700/60">
        <span className="font-mono-code text-[10px] text-slate-400 flex items-center gap-1.5 font-semibold">
          <Bookmark className="w-3.5 h-3.5 text-blue-400" />
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
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-all duration-150 active:scale-[0.99] ${
                    config.host === "192.168.1.100"
                      ? "border-blue-500/70 bg-blue-600/20 text-white shadow-sm font-semibold"
                      : "border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-600 text-slate-200"
                  }`}
                >
                  <span className="font-bold block text-slate-100">PORT 01: CAM-01 (Main Wall)</span>
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
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-all duration-150 active:scale-[0.99] ${
                    config.host === "192.168.1.101"
                      ? "border-blue-500/70 bg-blue-600/20 text-white shadow-sm font-semibold"
                      : "border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-600 text-slate-200"
                  }`}
                >
                  <span className="font-bold block text-slate-100">PORT 02: CAM-02 (Perimeter North)</span>
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
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-all duration-150 active:scale-[0.99] ${
                    config.host === "192.168.1.150"
                      ? "border-blue-500/70 bg-blue-600/20 text-white shadow-sm font-semibold"
                      : "border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-600 text-slate-200"
                  }`}
                >
                  <span className="font-bold block text-slate-100">Wi-Fi CAM-01 (Gate West)</span>
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
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-all duration-150 active:scale-[0.99] ${
                    config.host === "192.168.1.151"
                      ? "border-blue-500/70 bg-blue-600/20 text-white shadow-sm font-semibold"
                      : "border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-600 text-slate-200"
                  }`}
                >
                  <span className="font-bold block text-slate-100">Wi-Fi CAM-02 (South Guard)</span>
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
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all duration-150 active:scale-[0.99] col-span-2 ${
                  config.host === "10.10.20.117"
                    ? "border-blue-500/70 bg-blue-600/20 text-white shadow-sm font-semibold"
                    : "border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-600 text-slate-200"
                }`}
              >
                <span className="font-bold block text-slate-100">📱 GOOGLE PIXEL 6A (10.10.20.117:8080)</span>
                <span className="text-[9px] text-slate-400 block">Default Android IP Webcam Wi-Fi stream</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. Structured Parameters Form */}
      {isUsb ? (
        <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-[#06080E]/70 border border-slate-700/60">
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
              className={`bg-[#06080E] border text-white px-3 py-2 rounded-lg text-xs font-mono-code outline-none transition-all ${
                !isUsbValid ? "border-rose-500/80 bg-rose-950/20" : "border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#06080E]/70 border border-slate-700/60 text-[11px] font-mono-code">
          {/* Host / IP */}
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold">CAMERA HOST / IP ADDRESS:</span>
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
              className={`bg-[#06080E] border text-white px-3 py-2 rounded-lg text-xs font-mono-code outline-none transition-all ${
                !isHostValid
                  ? "border-rose-500/80 bg-rose-950/20 focus:border-rose-400"
                  : "border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
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
              <span className="flex items-center gap-1 font-semibold">
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
              className={`bg-[#06080E] border text-white px-3 py-2 rounded-lg text-xs font-mono-code outline-none transition-all ${
                !isPortValid
                  ? "border-rose-500/80 bg-rose-950/20 focus:border-rose-400"
                  : "border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
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
              <span className="flex items-center gap-1 font-semibold">
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
              className={`bg-[#06080E] border text-white px-3 py-2 rounded-lg text-xs font-mono-code outline-none transition-all ${
                !isStreamPathValid
                  ? "border-rose-500/80 bg-rose-950/20 focus:border-rose-400"
                  : "border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
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
            <span className="text-slate-300 font-semibold">TRANSPORT:</span>
            <select
              value={config.transportProtocol}
              onChange={(e) => onChangeField("transportProtocol", e.target.value as "tcp" | "udp")}
              className="bg-[#06080E] border border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 text-white px-2.5 py-2 rounded-lg text-xs font-mono-code outline-none cursor-pointer"
            >
              <option value="tcp">TCP (Reliable)</option>
              <option value="udp">UDP (Low Latency)</option>
            </select>
          </label>

          {/* Credentials */}
          <label className="flex flex-col gap-1">
            <span className="text-slate-300 flex items-center gap-1.5 font-semibold">
              <Lock className="w-3.5 h-3.5 text-blue-400" /> USERNAME:
            </span>
            <input
              type="text"
              value={config.username}
              onChange={(e) => onChangeField("username", e.target.value)}
              placeholder="admin"
              className="bg-[#06080E] border border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 text-white px-3 py-2 rounded-lg text-xs font-mono-code outline-none transition-all"
            />
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-slate-300 font-semibold">PASSWORD (OPTIONAL):</span>
            <input
              type="password"
              value={config.password}
              onChange={(e) => onChangeField("password", e.target.value)}
              placeholder="••••••••"
              className="bg-[#06080E] border border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 text-white px-3 py-2 rounded-lg text-xs font-mono-code outline-none transition-all"
            />
          </label>
        </div>
      )}

      {/* Real-time Validation Banner */}
      {!isFormValid ? (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono-code text-[11px] animate-in fade-in duration-150">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            CONNECTION PARAMETERS INCOMPLETE: Provide valid Camera Host IP and Port to proceed.
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 px-1 font-mono-code text-[11px] text-emerald-400 animate-in fade-in duration-150">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Parameters validated • Ready to test socket reachability</span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onBack}
          className="py-2 px-3.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-display text-xs font-semibold uppercase flex items-center gap-1.5 transition-colors border border-slate-700/80 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK</span>
        </button>

        <button
          type="button"
          onClick={handleNextClick}
          disabled={!isFormValid}
          className={`py-2 px-4 rounded-lg font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            isFormValid
              ? "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white border border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
              : "opacity-40 cursor-not-allowed border border-slate-800 bg-slate-800/50 text-slate-500 shadow-none pointer-events-none"
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

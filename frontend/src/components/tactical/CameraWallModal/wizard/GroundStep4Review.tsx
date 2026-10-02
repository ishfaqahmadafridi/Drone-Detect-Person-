"use client";

import React from "react";
import { GroundStep4ReviewProps } from "@/types";
import { StreamLinkProber } from "./StreamLinkProber";
import { ArrowLeft, Zap, ShieldCheck, Loader2 } from "lucide-react";

export const GroundStep4Review: React.FC<GroundStep4ReviewProps> = ({
  config,
  constructedUrl,
  onConnect,
  onBack,
  isConnecting,
}) => {
  const isWall = config.deviceCategory === "wall_cctv";
  const isWired = config.connectionType === "wired";

  return (
    <div className="flex flex-col gap-3.5 text-left animate-in fade-in duration-200">
      <div className="flex flex-col gap-0.5">
        <span className="font-display font-bold text-xs uppercase tracking-wider text-white">
          STEP 4: REVIEW & ESTABLISH SENSOR LINK
        </span>
        <span className="font-mono-code text-[10px] text-slate-400">
          Verify transmission parameters and test link reachability before promoting
        </span>
      </div>

      {/* Review Summary Card */}
      <div className="p-3.5 rounded-xl bg-[#06080E]/70 border border-slate-700/60 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-[11px] font-mono-code">
          <span className="text-slate-400 font-medium">HARDWARE PROFILE:</span>
          <span className="text-white font-bold uppercase">
            {isWall ? "PERIMETER WALL CCTV" : "MOBILE PATROL SMARTPHONE"}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono-code">
          <span className="text-slate-400 font-medium">TRANSMISSION MEDIUM:</span>
          <span className="text-blue-400 font-bold uppercase">
            {isWall
              ? isWired
                ? "WIRED (PoE+ 48V / CAT6 ETHERNET)"
                : "WIRELESS (802.11ac 5GHz Wi-Fi)"
              : "SMARTPHONE WI-FI IP UPLINK"}
          </span>
        </div>

        <div className="flex flex-col gap-1.5 pt-2.5 border-t border-slate-700/60 text-[10px] font-mono-code">
          <span className="text-slate-400 font-medium">CONSTRUCTED STREAM TARGET:</span>
          <div className="p-2.5 rounded-lg bg-[#06080E] border border-blue-500/40 text-blue-300 font-bold break-all select-all font-mono-code">
            {constructedUrl || "rtsp://192.168.1.100:554/live"}
          </div>
        </div>
      </div>

      {/* Standalone Link Reachability & Latency Prober Component */}
      <StreamLinkProber
        constructedUrl={constructedUrl}
        sourceType={isWall && !isWired && config.wirelessSubtype === "ap_direct" ? "rtsp" : "rtsp"}
        host={config.host}
        port={config.port}
        streamPath={config.streamPath}
        username={config.username}
        password={config.password}
      />

      {/* Navigation & Connect Action */}
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
          onClick={onConnect}
          disabled={isConnecting}
          className="py-2.5 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all border border-emerald-400/80 shadow-[0_0_18px_rgba(16,185,129,0.35)] cursor-pointer disabled:opacity-50"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>LINKING SENSOR...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-emerald-200" />
              <span>ESTABLISH SENSOR LINK</span>
            </>
          )}
        </button>
      </div>

      {/* Integrity Footer Note */}
      <div className="flex items-center gap-1.5 text-[9px] font-mono-code text-slate-400 px-1">
        <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
        <span>Hardware heartbeat and auto-fallback to simulation active upon disconnect</span>
      </div>
    </div>
  );
};

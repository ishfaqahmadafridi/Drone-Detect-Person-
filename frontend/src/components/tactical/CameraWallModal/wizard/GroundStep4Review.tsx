"use client";
import { CAMERA_UI_TEXT } from "@/constants/tactical";

import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


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
        <span className={TACTICAL_VIEW_STYLES.GroundStep1Device_span_className}>
          STEP 4: REVIEW & ESTABLISH SENSOR LINK
        </span>
        <span className={TACTICAL_VIEW_STYLES.GroundSensorModal_span_className_2}>
          Verify transmission parameters and test link reachability before promoting
        </span>
      </div>

      {/* Review Summary Card */}
      <div className={TACTICAL_VIEW_STYLES.GroundStep4Review_div_className}>
        <div className="flex items-center justify-between text-[11px] font-mono-code">
          <span className={TACTICAL_VIEW_STYLES.GroundStep4Review_span_className}>HARDWARE PROFILE:</span>
          <span className={TACTICAL_VIEW_STYLES.GroundStep4Review_span_className_2}>
            {isWall ? "PERIMETER WALL CCTV" : "MOBILE PATROL SMARTPHONE"}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono-code">
          <span className={TACTICAL_VIEW_STYLES.GroundStep4Review_span_className}>TRANSMISSION MEDIUM:</span>
          <span className={TACTICAL_VIEW_STYLES.GroundStep4Review_span_className_3}>
            {isWall
              ? isWired
                ? "WIRED (PoE+ 48V / CAT6 ETHERNET)"
                : "WIRELESS (802.11ac 5GHz Wi-Fi)"
              : "SMARTPHONE WI-FI IP UPLINK"}
          </span>
        </div>

        <div className={TACTICAL_VIEW_STYLES.GroundStep4Review_div_className_2}>
          <span className={TACTICAL_VIEW_STYLES.GroundStep4Review_span_className}>CONSTRUCTED STREAM TARGET:</span>
          <div className={TACTICAL_VIEW_STYLES.GroundStep4Review_div_className_3}>
            {constructedUrl || CAMERA_UI_TEXT.GroundStep4Review_5}
          </div>
        </div>
      </div>

      {/* Standalone Link Reachability & Latency Prober Component */}
      <StreamLinkProber
        constructedUrl={constructedUrl}
        sourceType={config.deviceCategory === "mobile_phone" ? "http" : "rtsp"}
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
          className={TACTICAL_VIEW_STYLES.GroundStep3Form_button_className}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK</span>
        </button>

        <button
          type="button"
          onClick={onConnect}
          disabled={isConnecting}
          className={TACTICAL_VIEW_STYLES.GroundStep4Review_button_className}
        >
          {isConnecting ? (
            <>
              <Loader2 className={TACTICAL_VIEW_STYLES.GroundStep4Review_Loader2_className} />
              <span>LINKING SENSOR...</span>
            </>
          ) : (
            <>
              <Zap className={TACTICAL_VIEW_STYLES.GroundStep4Review_Zap_className} />
              <span>ESTABLISH SENSOR LINK</span>
            </>
          )}
        </button>
      </div>

      {/* Integrity Footer Note */}
      <div className={TACTICAL_VIEW_STYLES.GroundStep4Review_div_className_4}>
        <ShieldCheck className={TACTICAL_VIEW_STYLES.GroundStep4Review_ShieldCheck_className} />
        <span>Hardware heartbeat and auto-fallback to simulation active upon disconnect</span>
      </div>
    </div>
  );
};

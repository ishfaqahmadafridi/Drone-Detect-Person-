"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


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
        <span className={TACTICAL_VIEW_STYLES.GroundStep1Device_span_className}>
          STEP 2: CHOOSE CONNECTION ARCHITECTURE
        </span>
        <span className={TACTICAL_VIEW_STYLES.GroundSensorModal_span_className_2}>
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
                  ? TACTICAL_VIEW_STYLES.GroundStep2Uplink_button_className
                  : TACTICAL_VIEW_STYLES.GroundStep2Uplink_button_className_2
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    connectionType === "wired"
                      ? TACTICAL_VIEW_STYLES.GroundStep2Uplink_div_className
                      : TACTICAL_VIEW_STYLES.GroundStep1Device_div_className_2
                  }`}
                >
                  <Zap className="w-5 h-5" />
                </div>
                {connectionType === "wired" && (
                  <span className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_span_className}>
                    <ShieldCheck className="w-3 h-3" /> ACTIVE
                  </span>
                )}
              </div>

              <div>
                <span className={TACTICAL_VIEW_STYLES.GroundStep1Device_span_className_3}>
                  WIRED CONNECTION
                </span>
                <span className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_span_className_2}>
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
                  ? TACTICAL_VIEW_STYLES.GroundStep1Device_button_className
                  : TACTICAL_VIEW_STYLES.GroundStep1Device_button_className_2
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    connectionType === "wireless"
                      ? TACTICAL_VIEW_STYLES.GroundStep1Device_div_className
                      : TACTICAL_VIEW_STYLES.GroundStep1Device_div_className_2
                  }`}
                >
                  <Wifi className="w-5 h-5" />
                </div>
                {connectionType === "wireless" && (
                  <span className={TACTICAL_VIEW_STYLES.GroundStep1Device_span_className_2}>
                    <ShieldCheck className={TACTICAL_VIEW_STYLES.GroundStep1Device_ShieldCheck_className} /> ACTIVE
                  </span>
                )}
              </div>

              <div>
                <span className={TACTICAL_VIEW_STYLES.GroundStep1Device_span_className_3}>
                  WIRELESS CONNECTION
                </span>
                <span className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_span_className_2}>
                  802.11ac 5GHz Wi-Fi / Secure CCTV Access Point
                </span>
              </div>
            </button>
          </div>

          {/* Subtype Selection */}
          <div className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_div_className_2}>
            <span className={TACTICAL_VIEW_STYLES.GroundSensorModal_span_className_2}>
              INTERFACE SPECIFICATION:
            </span>

            {connectionType === "wired" ? (
              <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
                <button
                  type="button"
                  onClick={() => onChangeWiredSubtype("poe_rtsp")}
                  className={`p-2.5 rounded-lg border text-left flex items-start gap-2 cursor-pointer transition-all duration-150 active:scale-[0.98] ${
                    wiredSubtype === "poe_rtsp"
                      ? TACTICAL_VIEW_STYLES.GroundStep2Uplink_button_className_3
                      : TACTICAL_VIEW_STYLES.GroundStep2Uplink_button_className_4
                  }`}
                >
                  <Cable className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_Cable_className} />
                  <div className="flex flex-col">
                    <span className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_span_className_3}>PoE Ethernet LAN (RTSP)</span>
                    <span className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_span_className_4}>
                      Standard security dome/bullet connected via switch or NVR port
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeWiredSubtype("usb_direct")}
                  className={`p-2.5 rounded-lg border text-left flex items-start gap-2 cursor-pointer transition-all duration-150 active:scale-[0.98] ${
                    wiredSubtype === "usb_direct"
                      ? TACTICAL_VIEW_STYLES.GroundStep2Uplink_button_className_5
                      : TACTICAL_VIEW_STYLES.GroundStep2Uplink_button_className_4
                  }`}
                >
                  <Zap className={TACTICAL_VIEW_STYLES.CardLocationSpecs_MapPin_className} />
                  <div className="flex flex-col">
                    <span className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_span_className_3}>Direct USB / HDMI Capture</span>
                    <span className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_span_className_4}>
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
                      ? TACTICAL_VIEW_STYLES.GroundStep2Uplink_button_className_5
                      : TACTICAL_VIEW_STYLES.GroundStep2Uplink_button_className_4
                  }`}
                >
                  <Wifi className={TACTICAL_VIEW_STYLES.CardLocationSpecs_MapPin_className} />
                  <div className="flex flex-col">
                    <span className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_span_className_3}>Facility Wi-Fi (IP/RTSP)</span>
                    <span className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_span_className_4}>
                      Camera connected to facility LAN / router subnet
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeWirelessSubtype("ap_direct")}
                  className={`p-2.5 rounded-lg border text-left flex items-start gap-2 cursor-pointer transition-all duration-150 active:scale-[0.98] ${
                    wirelessSubtype === "ap_direct"
                      ? TACTICAL_VIEW_STYLES.GroundStep2Uplink_button_className_5
                      : TACTICAL_VIEW_STYLES.GroundStep2Uplink_button_className_4
                  }`}
                >
                  <Radio className={TACTICAL_VIEW_STYLES.CardLocationSpecs_MapPin_className} />
                  <div className="flex flex-col">
                    <span className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_span_className_3}>Direct Camera AP Link</span>
                    <span className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_span_className_4}>
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
        <div className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_div_className_3}>
          <span className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_span_className_5}>
            MOBILE TRANSMISSION PROTOCOL:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
            <div className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_div_className_4}>
              <span className="font-bold block">Android IP Webcam (HTTP/MJPEG)</span>
              <span className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_span_className_6}>
                Port 8080 stream. Supported on Google Pixel, Samsung, and Android devices.
              </span>
            </div>
            <div className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_div_className_5}>
              <span className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_span_className_7}>iOS Live-Reporter (RTSP)</span>
              <span className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_span_className_6}>
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
          className={TACTICAL_VIEW_STYLES.GroundStep2Uplink_button_className_6}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className={TACTICAL_VIEW_STYLES.GroundStep1Device_button_className_3}
        >
          <span>NEXT: CONFIGURE PARAMETERS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default GroundStep2Uplink;

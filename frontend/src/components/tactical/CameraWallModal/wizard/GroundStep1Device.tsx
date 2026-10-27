"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


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
        <span className={TACTICAL_VIEW_STYLES.GroundStep1Device_span_className}>
          STEP 1: SELECT SENSOR CATEGORY
        </span>
        <span className={TACTICAL_VIEW_STYLES.GroundSensorModal_span_className_2}>
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
              ? TACTICAL_VIEW_STYLES.GroundStep1Device_button_className
              : TACTICAL_VIEW_STYLES.GroundStep1Device_button_className_2
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`p-2 rounded-lg ${
                selectedDevice === "wall_cctv"
                  ? TACTICAL_VIEW_STYLES.GroundStep1Device_div_className
                  : TACTICAL_VIEW_STYLES.GroundStep1Device_div_className_2
              }`}
            >
              <Video className="w-5 h-5" />
            </div>
            {selectedDevice === "wall_cctv" && (
              <span className={TACTICAL_VIEW_STYLES.GroundStep1Device_span_className_2}>
                <ShieldCheck className={TACTICAL_VIEW_STYLES.GroundStep1Device_ShieldCheck_className} /> SELECTED
              </span>
            )}
          </div>

          <div>
            <span className={TACTICAL_VIEW_STYLES.GroundStep1Device_span_className_3}>
              WALL CCTV CAMERA
            </span>
            <span className={TACTICAL_VIEW_STYLES.GroundStep1Device_span_className_4}>
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
              ? TACTICAL_VIEW_STYLES.GroundStep1Device_button_className
              : TACTICAL_VIEW_STYLES.GroundStep1Device_button_className_2
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`p-2 rounded-lg ${
                selectedDevice === "mobile_phone"
                  ? TACTICAL_VIEW_STYLES.GroundStep1Device_div_className
                  : TACTICAL_VIEW_STYLES.GroundStep1Device_div_className_2
              }`}
            >
              <Smartphone className="w-5 h-5" />
            </div>
            {selectedDevice === "mobile_phone" && (
              <span className={TACTICAL_VIEW_STYLES.GroundStep1Device_span_className_2}>
                <ShieldCheck className={TACTICAL_VIEW_STYLES.GroundStep1Device_ShieldCheck_className} /> SELECTED
              </span>
            )}
          </div>

          <div>
            <span className={TACTICAL_VIEW_STYLES.GroundStep1Device_span_className_3}>
              MOBILE PHONE / SMARTPHONE
            </span>
            <span className={TACTICAL_VIEW_STYLES.GroundStep1Device_span_className_4}>
              Field patrol handheld camera streaming over local Wi-Fi or RTSP / IP Webcam app.
            </span>
          </div>
        </button>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={onNext}
          className={TACTICAL_VIEW_STYLES.GroundStep1Device_button_className_3}
        >
          <span>NEXT: CHOOSE UPLINK</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default GroundStep1Device;

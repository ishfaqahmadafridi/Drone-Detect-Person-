"use client";
import { CAMERA_UI_TEXT } from "@/constants/tactical";

import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { GroundPresetPicker } from "./GroundPresetPicker";
import { groundSensorValidity } from "@/utils/groundSensorConfig";
import { GroundStep3FormProps } from "@/types";
import { ArrowLeft, ArrowRight, Lock, Network, AlertTriangle, CheckCircle2 } from "lucide-react";

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

  const validity = groundSensorValidity(config);
  const isHostValid = validity.host;
  const isPortValid = validity.port;
  const isStreamPathValid = validity.streamPath;
  const isUsbValid = validity.usb;
  const isFormValid = validity.valid;

  const handleNextClick = () => {
    if (!isFormValid) return;
    onNext();
  };

  return (
    <div className="flex flex-col gap-3.5 text-left animate-in fade-in duration-200">
      <div className="flex flex-col gap-0.5">
        <span className={TACTICAL_VIEW_STYLES.GroundStep1Device_span_className}>
          STEP 3: NETWORK & HARDWARE PARAMETERS
        </span>
        <span className={TACTICAL_VIEW_STYLES.GroundSensorModal_span_className_2}>
          Enter host IP, RTSP port, credentials, and transport options
        </span>
      </div>

      <GroundPresetPicker config={config} onApplyPreset={onApplyPreset} />

      {/* 2. Structured Parameters Form */}
      {isUsb ? (
        <div className={TACTICAL_VIEW_STYLES.GroundStep3Form_div_className}>
          <label className={TACTICAL_VIEW_STYLES.GroundStep3Form_label_className}>
            <span className="flex items-center gap-1">
              <span>USB HARDWARE DEVICE INDEX / DEV PATH:</span>
              <span className={TACTICAL_VIEW_STYLES.GroundStep3Form_span_className}>*</span>
            </span>
            <input
              type="text"
              value={config.usbDeviceIndex}
              onChange={(e) => onChangeField("usbDeviceIndex", e.target.value)}
              placeholder="0, 1, or /dev/video0"
              className={`${TACTICAL_VIEW_STYLES.GroundStep3Form_input_className}${
                !isUsbValid ? TACTICAL_VIEW_STYLES.GroundStep3Form_input_className_2 : TACTICAL_VIEW_STYLES.GroundStep3Form_input_className_3
              }`}
            />
            {!isUsbValid && (
              <span className={TACTICAL_VIEW_STYLES.GroundStep3Form_span_className_2}>
                * Required: Enter valid USB video device index
              </span>
            )}
          </label>
        </div>
      ) : (
        <div className={TACTICAL_VIEW_STYLES.GroundStep3Form_div_className_2}>
          {/* Host / IP */}
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className={TACTICAL_VIEW_STYLES.GroundStep3Form_span_className_3}>
              <span className="flex items-center gap-1.5">
                <Network className={TACTICAL_VIEW_STYLES.GroundStep3Form_Network_className} />
                <span className="font-semibold">CAMERA HOST / IP ADDRESS:</span>
                <span className={TACTICAL_VIEW_STYLES.GroundStep3Form_span_className}>*</span>
              </span>
              {!isHostValid && (
                <span className={TACTICAL_VIEW_STYLES.GroundStep3Form_span_className_4}>REQUIRED</span>
              )}
            </span>
            <input
              type="text"
              value={config.host}
              onChange={(e) => onChangeField("host", e.target.value)}
              placeholder={isWall ? CAMERA_UI_TEXT.GroundStep3Form_3 : CAMERA_UI_TEXT.GroundStep3Form_4}
              className={`${TACTICAL_VIEW_STYLES.GroundStep3Form_input_className}${
                !isHostValid
                  ? TACTICAL_VIEW_STYLES.GroundStep3Form_input_className_4
                  : TACTICAL_VIEW_STYLES.GroundStep3Form_input_className_3
              }`}
            />
            {!isHostValid && (
              <span className={TACTICAL_VIEW_STYLES.GroundStep3Form_span_className_2}>
                * Enter camera IP address or hostname
              </span>
            )}
          </label>

          {/* Port */}
          <label className="flex flex-col gap-1">
            <span className={TACTICAL_VIEW_STYLES.GroundStep3Form_span_className_3}>
              <span className="flex items-center gap-1 font-semibold">
                <span>PORT:</span>
                <span className={TACTICAL_VIEW_STYLES.GroundStep3Form_span_className}>*</span>
              </span>
              {!isPortValid && (
                <span className={TACTICAL_VIEW_STYLES.GroundStep3Form_span_className_4}>INVALID</span>
              )}
            </span>
            <input
              type="number"
              min={1}
              max={65535}
              value={config.port}
              onChange={(e) => onChangeField("port", e.target.value === "" ? 0 : Number(e.target.value))}
              placeholder={isWall ? "554" : "8080"}
              className={`${TACTICAL_VIEW_STYLES.GroundStep3Form_input_className}${
                !isPortValid
                  ? TACTICAL_VIEW_STYLES.GroundStep3Form_input_className_4
                  : TACTICAL_VIEW_STYLES.GroundStep3Form_input_className_3
              }`}
            />
            {!isPortValid && (
              <span className={TACTICAL_VIEW_STYLES.GroundStep3Form_span_className_2}>
                * Valid port (1-65535)
              </span>
            )}
          </label>

          {/* Stream Path */}
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className={TACTICAL_VIEW_STYLES.GroundStep3Form_span_className_3}>
              <span className="flex items-center gap-1 font-semibold">
                <span>STREAM PATH (URI):</span>
                <span className={TACTICAL_VIEW_STYLES.GroundStep3Form_span_className}>*</span>
              </span>
              {!isStreamPathValid && (
                <span className={TACTICAL_VIEW_STYLES.GroundStep3Form_span_className_4}>REQUIRED</span>
              )}
            </span>
            <input
              type="text"
              value={config.streamPath}
              onChange={(e) => onChangeField("streamPath", e.target.value)}
              placeholder={isWall ? "/live" : "/video"}
              className={`${TACTICAL_VIEW_STYLES.GroundStep3Form_input_className}${
                !isStreamPathValid
                  ? TACTICAL_VIEW_STYLES.GroundStep3Form_input_className_4
                  : TACTICAL_VIEW_STYLES.GroundStep3Form_input_className_3
              }`}
            />
            {!isStreamPathValid && (
              <span className={TACTICAL_VIEW_STYLES.GroundStep3Form_span_className_2}>
                * Required stream endpoint (e.g. /live or /video)
              </span>
            )}
          </label>

          {/* Transport Protocol */}
          <label className="flex flex-col gap-1">
            <span className={TACTICAL_VIEW_STYLES.GroundStep3Form_span_className_5}>TRANSPORT:</span>
            <select
              value={config.transportProtocol}
              onChange={(e) => onChangeField("transportProtocol", e.target.value as "tcp" | "udp")}
              className={TACTICAL_VIEW_STYLES.GroundStep3Form_select_className}
            >
              <option value="tcp">TCP (Reliable)</option>
              <option value="udp">UDP (Low Latency)</option>
            </select>
          </label>

          {/* Credentials */}
          <label className="flex flex-col gap-1">
            <span className={TACTICAL_VIEW_STYLES.GroundStep3Form_span_className_6}>
              <Lock className={TACTICAL_VIEW_STYLES.GroundStep3Form_Network_className} /> USERNAME:
            </span>
            <input
              type="text"
              value={config.username}
              onChange={(e) => onChangeField("username", e.target.value)}
              placeholder="admin"
              className={TACTICAL_VIEW_STYLES.GroundStep3Form_input_className_5}
            />
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className={TACTICAL_VIEW_STYLES.GroundStep3Form_span_className_5}>PASSWORD (OPTIONAL):</span>
            <input
              type="password"
              value={config.password}
              onChange={(e) => onChangeField("password", e.target.value)}
              placeholder="••••••••"
              className={TACTICAL_VIEW_STYLES.GroundStep3Form_input_className_5}
            />
          </label>
        </div>
      )}

      {/* Real-time Validation Banner */}
      {!isFormValid ? (
        <div className={TACTICAL_VIEW_STYLES.GroundStep3Form_div_className_3}>
          <AlertTriangle className={TACTICAL_VIEW_STYLES.GroundStep3Form_AlertTriangle_className} />
          <span>
            CONNECTION PARAMETERS INCOMPLETE: Provide valid Camera Host IP and Port to proceed.
          </span>
        </div>
      ) : (
        <div className={TACTICAL_VIEW_STYLES.GroundStep3Form_div_className_4}>
          <CheckCircle2 className={TACTICAL_VIEW_STYLES.GroundStep3Form_CheckCircle2_className} />
          <span>Parameters validated • Ready to test socket reachability</span>
        </div>
      )}

      {/* Navigation Buttons */}
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
          onClick={handleNextClick}
          disabled={!isFormValid}
          className={`py-2 px-4 rounded-lg font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            isFormValid
              ? TACTICAL_VIEW_STYLES.GroundStep3Form_button_className_2
              : TACTICAL_VIEW_STYLES.GroundStep3Form_button_className_3
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

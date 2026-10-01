"use client";

import React, { useState } from "react";
import {
  GroundSensorWizardProps,
  GroundWizardStep,
  GroundSensorConfigState,
} from "@/types";
import { GroundWizardStepIndicator } from "./GroundWizardStepIndicator";
import { GroundStep1Device } from "./GroundStep1Device";
import { GroundStep2Uplink } from "./GroundStep2Uplink";
import { GroundStep3Form } from "./GroundStep3Form";
import { GroundStep4Review } from "./GroundStep4Review";

export const GroundSensorWizard: React.FC<GroundSensorWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<GroundWizardStep>(1);
  const [maxStepReached, setMaxStepReached] = useState<GroundWizardStep>(1);

  const [config, setConfig] = useState<GroundSensorConfigState>({
    deviceCategory: "wall_cctv",
    connectionType: "wired",
    wiredSubtype: "poe_rtsp",
    wirelessSubtype: "wifi_rtsp",
    host: "192.168.1.100",
    port: 554,
    streamPath: "/live",
    username: "admin",
    password: "",
    transportProtocol: "tcp",
    usbDeviceIndex: "/dev/video0",
    phoneAppType: "android_ipwebcam",
  });

  const isStep3Valid = (): boolean => {
    const isWired = config.connectionType === "wired";
    const isUsb = isWired && config.wiredSubtype === "usb_direct";
    if (isUsb) {
      return Boolean(config.usbDeviceIndex && config.usbDeviceIndex.trim().length > 0);
    }
    const hasHost = Boolean(config.host && config.host.trim().length > 0);
    const hasPort = Boolean(
      config.port && !isNaN(Number(config.port)) && Number(config.port) >= 1 && Number(config.port) <= 65535
    );
    const hasPath = Boolean(config.streamPath && config.streamPath.trim().length > 0);
    return hasHost && hasPort && hasPath;
  };

  const goToStep = (step: GroundWizardStep) => {
    if (step === 4 && !isStep3Valid()) {
      return;
    }
    setCurrentStep(step);
    if (step > maxStepReached) {
      setMaxStepReached(step);
    }
  };

  const handleNext = () => {
    if (currentStep === 3 && !isStep3Valid()) {
      return;
    }
    if (currentStep < 4) {
      goToStep((currentStep + 1) as GroundWizardStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep((currentStep - 1) as GroundWizardStep);
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleChangeField = <K extends keyof GroundSensorConfigState>(
    field: K,
    value: GroundSensorConfigState[K]
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyPreset = (preset: Partial<GroundSensorConfigState>) => {
    setConfig((prev) => ({ ...prev, ...preset }));
  };

  // Helper to build URL
  const constructEffectiveUrl = (cfg: GroundSensorConfigState): string => {
    if (cfg.deviceCategory === "mobile_phone") {
      const portPart = cfg.port ? `:${cfg.port}` : ":8080";
      const pathPart = cfg.streamPath.startsWith("/") ? cfg.streamPath : `/${cfg.streamPath}`;
      return `http://${cfg.host}${portPart}${pathPart}`;
    }

    if (cfg.connectionType === "wired" && cfg.wiredSubtype === "usb_direct") {
      return cfg.usbDeviceIndex || "0";
    }

    const auth = cfg.username ? `${cfg.username}${cfg.password ? `:${cfg.password}` : ""}@` : "";
    const portPart = cfg.port ? `:${cfg.port}` : ":554";
    const pathPart = cfg.streamPath.startsWith("/") ? cfg.streamPath : `/${cfg.streamPath}`;
    return `rtsp://${auth}${cfg.host}${portPart}${pathPart}`;
  };

  const constructedUrl = constructEffectiveUrl(config);

  const handleConnect = () => {
    onComplete(constructedUrl);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* 1. Step Progress Bar */}
      <GroundWizardStepIndicator
        currentStep={currentStep}
        maxStepReached={maxStepReached}
        onStepClick={goToStep}
      />

      {/* 2. Step Views */}
      {currentStep === 1 && (
        <GroundStep1Device
          selectedDevice={config.deviceCategory}
          onSelectDevice={(device) => {
            handleChangeField("deviceCategory", device);
            if (device === "mobile_phone") {
              setConfig((prev) => ({
                ...prev,
                deviceCategory: "mobile_phone",
                host: "10.10.20.117",
                port: 8080,
                streamPath: "/video",
                username: "",
                password: "",
              }));
            } else {
              setConfig((prev) => ({
                ...prev,
                deviceCategory: "wall_cctv",
                host: "192.168.1.100",
                port: 554,
                streamPath: "/live",
                username: "admin",
              }));
            }
          }}
          onNext={handleNext}
        />
      )}

      {currentStep === 2 && (
        <GroundStep2Uplink
          deviceCategory={config.deviceCategory}
          connectionType={config.connectionType}
          wiredSubtype={config.wiredSubtype}
          wirelessSubtype={config.wirelessSubtype}
          onChangeConnectionType={(type) => {
            handleChangeField("connectionType", type);
            if (type === "wireless") {
              setConfig((prev) => ({ ...prev, host: "192.168.1.150", port: 8554 }));
            } else {
              setConfig((prev) => ({ ...prev, host: "192.168.1.100", port: 554 }));
            }
          }}
          onChangeWiredSubtype={(sub) => handleChangeField("wiredSubtype", sub)}
          onChangeWirelessSubtype={(sub) => handleChangeField("wirelessSubtype", sub)}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {currentStep === 3 && (
        <GroundStep3Form
          config={config}
          onChangeField={handleChangeField}
          onApplyPreset={handleApplyPreset}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {currentStep === 4 && (
        <GroundStep4Review
          config={config}
          constructedUrl={constructedUrl}
          onConnect={handleConnect}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default GroundSensorWizard;
export * from "./GroundWizardStepIndicator";
export * from "./GroundStep1Device";
export * from "./GroundStep2Uplink";
export * from "./GroundStep3Form";
export * from "./GroundStep4Review";

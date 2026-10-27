"use client";

import React from "react";
import { GROUND_SENSOR_DEFAULTS, GROUND_PHONE_PRESET, GROUND_WIFI_PRESET } from "@/constants/tactical";
import { useGroundSensorWizard } from "@/hooks/useGroundSensorWizard";
import {
  GroundSensorWizardProps,
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
  const { currentStep, maxStepReached, config, goToStep, handleNext, handleBack,
    handleChangeField, handleApplyPreset, constructedUrl, handleConnect, setConfig } =
    useGroundSensorWizard({ onComplete, onCancel });

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
                ...GROUND_PHONE_PRESET,
              }));
            } else {
              setConfig((prev) => ({
                ...prev,
                deviceCategory: "wall_cctv",
                host: GROUND_SENSOR_DEFAULTS.host,
                port: GROUND_SENSOR_DEFAULTS.port,
                streamPath: GROUND_SENSOR_DEFAULTS.streamPath,
                username: GROUND_SENSOR_DEFAULTS.username,
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
              setConfig((prev) => ({ ...prev, ...GROUND_WIFI_PRESET }));
            } else {
              setConfig((prev) => ({ ...prev, host: GROUND_SENSOR_DEFAULTS.host, port: GROUND_SENSOR_DEFAULTS.port }));
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

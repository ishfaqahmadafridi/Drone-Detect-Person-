import { useState } from "react";
import { GROUND_SENSOR_DEFAULTS } from "@/constants/tactical";
import { groundSensorValidity, groundSensorUrl } from "@/utils/groundSensorConfig";
import type { GroundWizardStep, GroundSensorConfigState, GroundSensorWizardProps } from "@/types";

export function useGroundSensorWizard({ onComplete, onCancel }: GroundSensorWizardProps) {
  const [currentStep, setCurrentStep] = useState<GroundWizardStep>(1);
  const [maxStepReached, setMaxStepReached] = useState<GroundWizardStep>(1);

  const [config, setConfig] = useState<GroundSensorConfigState>({ ...GROUND_SENSOR_DEFAULTS });
  const isStep3Valid = () => groundSensorValidity(config).valid;

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

  const constructedUrl = groundSensorUrl(config);

  const handleConnect = () => {
    onComplete(constructedUrl);
  };

  return { currentStep, maxStepReached, config, goToStep, handleNext, handleBack,
    handleChangeField, handleApplyPreset, constructedUrl, handleConnect, setConfig };
}

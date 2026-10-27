"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { GroundWizardStepIndicatorProps, GroundWizardStepOption } from "@/types";
import { Check } from "lucide-react";

export const GroundWizardStepIndicator: React.FC<GroundWizardStepIndicatorProps> = ({
  currentStep,
  maxStepReached,
  onStepClick,
}) => {
  const steps: GroundWizardStepOption[] = [
    { number: 1, title: "DEVICE" },
    { number: 2, title: "UPLINK" },
    { number: 3, title: "CONFIG" },
    { number: 4, title: "CONNECT" },
  ];

  return (
    <div className={TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_div_className}>
      {steps.map((step, idx) => {
        const isCurrent = currentStep === step.number;
        const isCompleted = currentStep > step.number;
        const isClickable = step.number <= maxStepReached;

        return (
          <React.Fragment key={step.number}>
            {idx > 0 && (
              <div
                className={`flex-1 h-[2px] mx-2 transition-colors ${
                  currentStep >= step.number ? TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_div_className_2 : TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_div_className_3
                }`}
              />
            )}
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => onStepClick(step.number)}
              className={`flex items-center gap-1.5 transition-all text-left ${
                isClickable ? "cursor-pointer group active:scale-95" : "cursor-not-allowed opacity-50"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center font-mono-code text-[10px] font-bold transition-all ${
                  isCurrent
                    ? TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_div_className_4
                    : isCompleted
                    ? TACTICAL_VIEW_STYLES.GroundStep2Uplink_div_className
                    : TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_div_className_5
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3" /> : step.number}
              </div>
              <span
                className={`font-display text-[10px] font-bold tracking-wider uppercase transition-colors ${
                  isCurrent
                    ? TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_span_className
                    : isCompleted
                    ? TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_span_className_2
                    : TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_span_className_3
                }`}
              >
                {step.title}
              </span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default GroundWizardStepIndicator;

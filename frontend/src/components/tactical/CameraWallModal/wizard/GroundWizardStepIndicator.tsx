"use client";

import React from "react";
import { GroundWizardStepIndicatorProps, GroundWizardStep } from "@/types";
import { Check } from "lucide-react";

export const GroundWizardStepIndicator: React.FC<GroundWizardStepIndicatorProps> = ({
  currentStep,
  maxStepReached,
  onStepClick,
}) => {
  const steps: { number: GroundWizardStep; title: string }[] = [
    { number: 1, title: "DEVICE" },
    { number: 2, title: "UPLINK" },
    { number: 3, title: "CONFIG" },
    { number: 4, title: "CONNECT" },
  ];

  return (
    <div className="w-full flex items-center justify-between px-3 py-2 bg-[#0A0D14] rounded-xl border border-slate-700/60">
      {steps.map((step, idx) => {
        const isCurrent = currentStep === step.number;
        const isCompleted = currentStep > step.number;
        const isClickable = step.number <= maxStepReached;

        return (
          <React.Fragment key={step.number}>
            {idx > 0 && (
              <div
                className={`flex-1 h-[2px] mx-2 transition-colors ${
                  currentStep >= step.number ? "bg-blue-500/60" : "bg-slate-800"
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
                    ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.5)] scale-110"
                    : isCompleted
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3" /> : step.number}
              </div>
              <span
                className={`font-display text-[10px] font-bold tracking-wider uppercase transition-colors ${
                  isCurrent
                    ? "text-blue-400"
                    : isCompleted
                    ? "text-emerald-400/80"
                    : "text-slate-400"
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

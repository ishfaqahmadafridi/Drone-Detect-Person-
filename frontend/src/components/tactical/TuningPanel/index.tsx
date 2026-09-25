"use client";

import React from "react";
import { useTuningForm } from "@/hooks";
import { TuningHeader } from "./TuningHeader";
import { TuningSlider } from "./TuningSlider";

export const TuningPanel: React.FC = () => {
  const {
    multiThresh,
    setMultiThresh,
    conf,
    setConf,
    proxDist,
    setProxDist,
    showSavedToast,
    isPending,
    handleSubmit,
  } = useTuningForm();

  return (
    <div className="glass-panel p-4 rounded-xl flex flex-col gap-3.5 border border-slate-800">
      <TuningHeader showSavedToast={showSavedToast} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <TuningSlider
          label="Multi-Person Alert Trigger:"
          badgeValue={`>= ${multiThresh} People`}
          min={1}
          max={8}
          value={multiThresh}
          onChange={setMultiThresh}
        />

        <TuningSlider
          label="Detection Confidence:"
          badgeValue={conf.toFixed(2)}
          min={0.1}
          max={0.9}
          step={0.05}
          value={conf}
          onChange={setConf}
        />

        <TuningSlider
          label="Gathering Proximity:"
          badgeValue={`${proxDist} px`}
          min={40}
          max={260}
          step={10}
          value={proxDist}
          onChange={setProxDist}
        />

        <button
          type="submit"
          disabled={isPending}
          className="mt-1 w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 py-1.5 rounded-lg font-display text-xs font-semibold uppercase tracking-wider transition-colors shadow-[0_0_10px_rgba(0,242,254,0.15)] disabled:opacity-50"
        >
          {isPending ? "Applying..." : "Apply Parameters"}
        </button>
      </form>
    </div>
  );
};

export default TuningPanel;

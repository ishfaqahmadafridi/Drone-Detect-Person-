"use client";

import React, { useState } from "react";
import { useTuningForm } from "@/hooks";
import { TuningHeader } from "./TuningHeader";
import { TuningSlider } from "./TuningSlider";

export const TuningPanel: React.FC = () => {
  const {
    conf,
    setConf,
    showSavedToast,
    isPending,
    handleSubmit,
  } = useTuningForm();

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
      {/* Collapsible Header — click to expand/collapse */}
      <div className={`px-4 py-3 ${isOpen ? "border-b border-slate-800" : ""}`}>
        <TuningHeader
          showSavedToast={showSavedToast}
          isOpen={isOpen}
          onToggle={() => setIsOpen((prev) => !prev)}
        />
      </div>

      {/* Expandable Parameters Body */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="px-4 pb-4 flex flex-col gap-3 pt-3">

          <TuningSlider
            label="Detection Confidence:"
            badgeValue={conf.toFixed(2)}
            min={0.1}
            max={0.9}
            step={0.05}
            value={conf}
            onChange={setConf}
          />


          <button
            type="submit"
            disabled={isPending}
            className="mt-1 w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white border border-blue-500/60 py-2 rounded-lg font-display text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all duration-150 active:scale-[0.98] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Applying..." : "Apply Parameters"}
          </button>
        </form>
      )}
    </div>
  );
};

export default TuningPanel;

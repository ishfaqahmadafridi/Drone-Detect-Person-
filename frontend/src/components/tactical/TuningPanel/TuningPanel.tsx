"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import { useToggle } from "@/hooks/useToggle";
import React from "react";
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

  const [isOpen, setIsOpen] = useToggle(true);

  return (
    <div className={TACTICAL_VIEW_STYLES.TuningPanel_div_className}>
      {/* Collapsible Header — click to expand/collapse */}
      <div className={`px-4 py-3 ${isOpen ? TACTICAL_VIEW_STYLES.TuningPanel_div_className_2 : ""}`}>
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
            className={TACTICAL_VIEW_STYLES.TuningPanel_button_className}
          >
            {isPending ? "Applying..." : "Apply Parameters"}
          </button>
        </form>
      )}
    </div>
  );
};

export default TuningPanel;

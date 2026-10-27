"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { VIDEO_TESTING } from "@/constants/tactical";
import type { SuspectQuickSelectChipsProps } from "@/types";

export const SuspectQuickSelectChips: React.FC<SuspectQuickSelectChipsProps> = ({
  detections,
  pending,
  onSelectPerson,
}) => {
  if (!detections.length) return null;

  return (
    <div className={TACTICAL_VIEW_STYLES.SuspectQuickSelectChips_div_className}>
      <span className={TACTICAL_VIEW_STYLES.SuspectQuickSelectChips_span_className}>Quick Select:</span>
      {detections.slice(0, VIDEO_TESTING.quickSelectLimit).map(person => (
        <button
          key={person.id}
          type="button"
          onClick={() => onSelectPerson(person.id)}
          disabled={pending}
          className={TACTICAL_VIEW_STYLES.SuspectQuickSelectChips_button_className}
          title={`Instantly capture and send Person #${person.id} to Aerial Re-ID`}
        >
          <span className={TACTICAL_VIEW_STYLES.SuspectQuickSelectChips_span_className_2}></span>
          <span>Person #{person.id} ({Math.round((person.conf ?? 0) * 100)}%)</span>
        </button>
      ))}
    </div>
  );
};

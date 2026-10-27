import React from "react";
import { SUSPECT_FREEZE_STYLES, VIDEO_TESTING } from "@/constants/tactical";
import type { FrozenSuspectChoicesProps } from "@/types";

export const FrozenSuspectChoices: React.FC<FrozenSuspectChoicesProps> = ({
  snapshot, selectedIds, pending, onToggle,
}) => (
  <div className={SUSPECT_FREEZE_STYLES.choices}>
    {snapshot.detections.map(person => (
      <button
        key={person.id}
        type="button"
        className={selectedIds.includes(person.id) ? SUSPECT_FREEZE_STYLES.selectedChoice : VIDEO_TESTING.buttonClass}
        aria-pressed={selectedIds.includes(person.id)}
        onClick={() => onToggle(person.id)}
        disabled={pending}
      >
        {selectedIds.includes(person.id) ? "✓ Selected" : "Select"} #{person.id}
      </button>
    ))}
  </div>
);

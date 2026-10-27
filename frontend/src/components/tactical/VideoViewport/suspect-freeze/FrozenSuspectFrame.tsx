import React from "react";
import { SUSPECT_FREEZE_STYLES, VIDEO_TESTING } from "@/constants/tactical";
import type { FrozenSuspectFrameProps } from "@/types";
import { suspectBoxStyle } from "@/utils/suspectFrameGeometry";

export const FrozenSuspectFrame: React.FC<FrozenSuspectFrameProps> = ({
  snapshot, selectedIds, pending, onToggle,
}) => (
  <div
    className={SUSPECT_FREEZE_STYLES.frame}
    style={{ aspectRatio: `${snapshot.width} / ${snapshot.height}` }}
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={snapshot.image}
      alt="Frozen ground-camera frame for suspect selection"
      className={SUSPECT_FREEZE_STYLES.image}
    />
    {snapshot.detections.map(person => (
      <button
        key={person.id}
        type="button"
        aria-label={`Select suspect ${person.id}`}
        aria-pressed={selectedIds.includes(person.id)}
        disabled={pending}
        onClick={() => onToggle(person.id)}
        className={selectedIds.includes(person.id) ? VIDEO_TESTING.selectedBoxClass : VIDEO_TESTING.boxClass}
        style={suspectBoxStyle(person, snapshot)}
      >
        <span className={VIDEO_TESTING.boxLabelClass}>
          #{person.id} | {Math.round(person.conf * 100)}%
        </span>
      </button>
    ))}
  </div>
);
